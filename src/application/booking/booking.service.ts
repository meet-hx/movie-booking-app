import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { BookingRepository } from '../../domain/repositories/booking/booking.repository';
import { REPOSITORY_TOKENS } from '../../infrastructure/persistence/tokens';
import { ShowService } from '../show/show.service';
import {
  CreateBookingIntentRequestDto,
  CreateBookingIntentResponseDto,
} from './dto/create-booking-intent.dto';
import { Strings } from '../../utils/strings';
import { SeatService } from '../seat/seat.service';
import type { PaymentIntentRepository } from '../../domain/repositories/paymentIntent/payment-intent.repository';
import type { WebhookEventRepository } from '../../domain/repositories/webhookEvent/webhook-event.repository';
import Stripe from 'stripe';
import {
  BookingStatus,
  PaymentIntentStatus,
  PaymentStatus,
} from 'src/generated/prisma/client';
import {
  CreatePaymentIntentRequestDto,
  CreatePaymentIntentResponseDto,
} from './dto/create-payment-intent.dto';
import { GetBookingStatusResponseDto } from './dto/get-booking-status.dto';
import { Decimal } from '@prisma/client/runtime/client';

@Injectable()
export class BookingService {
  private static readonly SERVICE_CHARGE_RATE = 0.05;
  private static readonly HOLD_MINUTES = 10;

  private stripeClient: Stripe | null = null;

  constructor(
    @Inject(REPOSITORY_TOKENS.BookingRepository)
    private readonly bookingRepository: BookingRepository,
    @Inject(REPOSITORY_TOKENS.PaymentIntentRepository)
    private readonly paymentIntentRepository: PaymentIntentRepository,
    @Inject(REPOSITORY_TOKENS.WebhookEventRepository)
    private readonly webhookEventRepository: WebhookEventRepository,
    private readonly showService: ShowService,
    private readonly seatService: SeatService,
    private readonly configService: ConfigService,
  ) {}

  async createBookingIntent(
    request: CreateBookingIntentRequestDto,
    userId: string,
  ): Promise<CreateBookingIntentResponseDto> {
    const show = await this.showService.findById(request.showId);
    if (!show) {
      throw new NotFoundException(Strings.show.notFound);
    }

    const screenId = show.theaterScreenId;

    const seatSelections =
      await this.seatService.findSeatDetailsByRowAndNumbers(
        screenId,
        request.seats.map((s) => ({
          rowNumber: s.row,
          seatNumber: parseInt(s.seatNo, 10),
        })),
      );

    if (seatSelections.length !== request.seats.length) {
      throw new NotFoundException(Strings.screenSeat.notFound);
    }

    const orderedSelections = seatSelections;

    const seatIds = orderedSelections.map((seat) => seat.id);
    const bookedSeatIds = await this.bookingRepository.findBookedSeatIds(
      request.showId,
      seatIds,
    );

    if (bookedSeatIds.length > 0) {
      throw new ConflictException(Strings.booking.seatAlreadyBooked);
    }

    const basePrice = show.basePrice.toNumber();
    const seatAmounts = orderedSelections.map((seat) => ({
      seatId: seat.id,
      amount: this.roundAmount(basePrice + seat.seatCategory.additionalPrice),
      bookingStatus: BookingStatus.RESERVED,
    }));

    const seatResponse = orderedSelections.map((seat, index) => ({
      seatId: seat.id,
      categoryId: seat.seatCategory.id,
      categoryName: seat.seatCategory.name,
      rowNumber: seat.rowNumber,
      seatNumbers: [seat.seatNumber],
      amount: seatAmounts[index].amount,
    }));

    const categoryMap = new Map<
      string,
      {
        categoryId: string;
        categoryName: string;
        seatCount: number;
        pricePerSeat: number;
        totalAmount: number;
      }
    >();

    seatResponse.forEach((seat) => {
      const existing = categoryMap.get(seat.categoryId);
      if (existing) {
        existing.seatCount += 1;
        existing.totalAmount = this.roundAmount(
          existing.totalAmount + seat.amount,
        );
        return;
      }

      categoryMap.set(seat.categoryId, {
        categoryId: seat.categoryId,
        categoryName: seat.categoryName,
        seatCount: 1,
        pricePerSeat: seat.amount,
        totalAmount: seat.amount,
      });
    });

    const totalSeatAmount = this.roundAmount(
      seatAmounts.reduce((total, seat) => total + seat.amount, 0),
    );
    const serviceAmount = this.roundAmount(
      totalSeatAmount * BookingService.SERVICE_CHARGE_RATE,
    );
    const payableAmount = this.roundAmount(totalSeatAmount + serviceAmount);
    const expiresAt = new Date(
      Date.now() + BookingService.HOLD_MINUTES * 60 * 1000,
    );

    const booking = await this.bookingRepository.create({
      userId,
      showId: request.showId,
      bookingTime: new Date(),
      expiresAt,
      totalAmount: payableAmount,
      serviceCharge: serviceAmount,
      paymentStatus: PaymentStatus.PENDING,
      seats: seatAmounts.map((seat) => ({
        seatId: seat.seatId,
        amount: Decimal(seat.amount),
        bookingStatus: BookingStatus.RESERVED,
      })),
    });

    return {
      bookingIntentId: booking.id,
      showId: booking.showId,
      basePrice,
      screenId,
      seats: seatResponse,
      categoryAmounts: Array.from(categoryMap.values()),
      totalSeatAmount,
      serviceAmount,
      payableAmount,
      expiresAt: booking.expiresAt,
    };
  }

  async createPaymentIntent(
    bookingIntentId: string,
    userId: string,
    request: CreatePaymentIntentRequestDto,
  ): Promise<CreatePaymentIntentResponseDto> {
    const booking =
      await this.bookingRepository.findByIdWithSeats(bookingIntentId);
    if (!booking || booking.userId !== userId) {
      throw new NotFoundException(Strings.booking.intentNotFound);
    }

    if (booking.paymentStatus !== PaymentStatus.PENDING) {
      throw new ConflictException(Strings.booking.intentAlreadyProcessed);
    }

    if (booking.expiresAt.getTime() <= Date.now()) {
      throw new BadRequestException(Strings.booking.intentExpired);
    }

    const existingPaymentIntent =
      await this.paymentIntentRepository.findByBookingId(bookingIntentId);
    if (existingPaymentIntent) {
      return {
        bookingIntentId,
        paymentIntentId: existingPaymentIntent.stripePaymentIntentId,
        clientSecret: existingPaymentIntent.clientSecret,
        amount: existingPaymentIntent.amount,
        currency: existingPaymentIntent.currency,
        expiresAt: booking.expiresAt,
      };
    }

    const currency = request.currency ?? 'inr';
    const amount = this.roundAmount(booking.totalAmount);
    const stripeAmount = Math.round(amount * 100);
    const stripe = this.getStripeClient();

    const seatIds = booking.seats.map((seat) => seat.seatId);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: stripeAmount,
      currency,
      metadata: {
        bookingIntentId,
        showId: booking.showId,
        seatIds: seatIds.join(','),
      },
    });

    await this.paymentIntentRepository.create({
      bookingId: bookingIntentId,
      userId: booking.userId,
      stripePaymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret ?? '',
      status: this.mapStripeStatus(paymentIntent.status),
      amount,
      currency,
      rawEvent: paymentIntent as unknown as Record<string, unknown>,
    });

    return {
      bookingIntentId,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret ?? '',
      amount,
      currency,
      expiresAt: booking.expiresAt,
    };
  }

  async getBookingStatus(
    bookingIntentId: string,
    userId: string,
  ): Promise<GetBookingStatusResponseDto> {
    const booking =
      await this.bookingRepository.findByIdWithSeats(bookingIntentId);
    if (!booking || booking.userId !== userId) {
      throw new NotFoundException(Strings.booking.intentNotFound);
    }

    return {
      bookingIntentId: booking.id,
      showId: booking.showId,
      paymentStatus: booking.paymentStatus,
      expiresAt: booking.expiresAt,
      totalAmount: booking.totalAmount,
      serviceCharge: booking.serviceCharge,
      seats: booking.seats.map((seat) => ({
        seatId: seat.seatId,
        status: seat.bookingStatus,
        amount: Number(seat.amount),
      })),
    };
  }

  async handleStripeWebhook(
    payload: Buffer,
    signature: string | undefined,
  ): Promise<{ received: boolean }> {
    const stripe = this.getStripeClient();
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    if (!webhookSecret || !signature) {
      throw new BadRequestException(Strings.booking.webhookSignatureMissing);
    }

    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );

    if (await this.webhookEventRepository.exists(event.id)) {
      return { received: true };
    }

    await this.webhookEventRepository.create({
      id: event.id,
      type: event.type,
      payload: event as unknown as Record<string, unknown>,
    });

    if (!event.type.startsWith('payment_intent.')) {
      return { received: true };
    }

    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const storedPaymentIntent =
      await this.paymentIntentRepository.findByStripePaymentIntentId(
        paymentIntent.id,
      );

    if (!storedPaymentIntent) {
      return { received: true };
    }

    const booking = await this.bookingRepository.findByIdWithSeats(
      storedPaymentIntent.bookingId,
    );

    if (!booking) {
      return { received: true };
    }

    const mappedStatus = this.mapStripeStatus(paymentIntent.status);
    await this.paymentIntentRepository.updateStatus(
      paymentIntent.id,
      mappedStatus,
      paymentIntent as unknown as Record<string, unknown>,
    );

    if (booking.paymentStatus !== PaymentStatus.PENDING) {
      return { received: true };
    }

    const isExpired = booking.expiresAt.getTime() <= Date.now();
    if (event.type === 'payment_intent.succeeded' && !isExpired) {
      await this.bookingRepository.updatePaymentStatusAndSeats(
        booking.id,
        PaymentStatus.PAID,
        BookingStatus.CONFIRMED,
      );
      return { received: true };
    }

    if (
      event.type === 'payment_intent.payment_failed' ||
      event.type === 'payment_intent.canceled' ||
      isExpired
    ) {
      await this.bookingRepository.updatePaymentStatusAndSeats(
        booking.id,
        PaymentStatus.FAILED,
        BookingStatus.CANCELLED,
      );
    }

    return { received: true };
  }

  private roundAmount(amount: number): number {
    return Number(amount.toFixed(2));
  }

  private getStripeClient(): Stripe {
    if (this.stripeClient) {
      return this.stripeClient;
    }

    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      throw new BadRequestException(Strings.booking.stripeNotConfigured);
    }

    this.stripeClient = new Stripe(secretKey, {
      apiVersion: '2024-06-20',
    });

    return this.stripeClient;
  }

  private mapStripeStatus(status: string): PaymentIntentStatus {
    switch (status) {
      case 'requires_payment_method':
        return PaymentIntentStatus.REQUIRES_PAYMENT_METHOD;
      case 'requires_confirmation':
        return PaymentIntentStatus.REQUIRES_CONFIRMATION;
      case 'requires_action':
        return PaymentIntentStatus.REQUIRES_ACTION;
      case 'processing':
        return PaymentIntentStatus.PROCESSING;
      case 'succeeded':
        return PaymentIntentStatus.SUCCEEDED;
      case 'canceled':
        return PaymentIntentStatus.CANCELED;
      default:
        return PaymentIntentStatus.REQUIRES_PAYMENT_METHOD;
    }
  }
}
