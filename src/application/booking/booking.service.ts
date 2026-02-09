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
import { PaginatedBookingHistoryResponseDto } from './dto/get-booking-history.dto';

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

    const selections = orderedSelections.map((seat) => ({
      seatId: seat.id,
      seatNumber: seat.seatNumber,
    }));

    const conflictingSeats = await this.bookingRepository.findConflictingSeats(
      request.showId,
      selections,
      userId,
    );

    if (conflictingSeats.length > 0) {
      const conflictingLabels = conflictingSeats.map((cs) => {
        const seat = orderedSelections.find((s) => s.id === cs.seatId);
        return `${seat?.rowNumber}${cs.seatNumber}`;
      });

      throw new ConflictException(
        Strings.booking.seatAlreadyBooked({ seats: conflictingLabels }),
      );
    }

    const basePrice = show.basePrice.toNumber();
    const seatAmounts = orderedSelections.map((seat) => ({
      seatId: seat.id,
      seatNumber: seat.seatNumber,
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
        seatNumber: seat.seatNumber,
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
      // For checkout, we might want to redirect to the same session URL if it hasn't expired
      // But Stripe checkout sessions can't easily be "retrieved" for the URL if not stored.
      // We'll store the URL in clientSecret field for now as a workaround or just create a new one.
      // Actually, let's create a new one to be safe, or if existing, return it.
      return {
        bookingIntentId,
        checkoutUrl: existingPaymentIntent.clientSecret, // We stored URL here
        paymentIntentId: existingPaymentIntent.stripePaymentIntentId,
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

    // Stripe checkout session creation
    // We removed payment_method_types to allow configuration via Stripe Dashboard
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: 'Movie Tickets Booking',
              description: `Booking ID: ${bookingIntentId}`,
            },
            unit_amount: stripeAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: request.successUrl,
      cancel_url: request.cancelUrl,
      metadata: {
        bookingIntentId,
        showId: booking.showId,
        seatIds: seatIds.join(','),
      },
      expires_at: Math.max(
        Math.floor(Date.now() / 1000) + 31 * 60, // Minimum 31 minutes from now
        Math.floor(booking.expiresAt.getTime() / 1000) + 5 * 60, // Adding 5 min buffer to our own expiry
      ),
    });

    console.log(`[Stripe Checkout] Session created: ${session.id}`);
    console.log(`[Stripe Checkout] URL: ${session.url}`);

    await this.paymentIntentRepository.create({
      bookingId: bookingIntentId,
      userId: booking.userId,
      stripePaymentIntentId: session.id, // Store session ID
      clientSecret: session.url ?? '', // Store URL in clientSecret field for now
      status: this.mapStripeStatus(session.status ?? 'requires_payment_method'),
      amount,
      currency,
      rawEvent: session as unknown as Record<string, unknown>,
    });

    return {
      bookingIntentId,
      checkoutUrl: session.url ?? '',
      paymentIntentId: session.id,
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

  async getBookingHistory(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedBookingHistoryResponseDto> {
    const skip = (page - 1) * limit;
    const { data, total } =
      await this.bookingRepository.findByUserIdWithDetails(userId, skip, limit);

    const totalPages = Math.ceil(total / limit);

    return {
      docs: data.map((item) => {
        // Group seats by category for categoryAmounts
        const categoryMap = new Map<
          string,
          {
            categoryId: string;
            categoryName: string;
            seatCount: number;
            totalAmount: number;
            pricePerSeat: number;
          }
        >();

        // Transform seats and group by category
        const transformedSeats = item.seats.map((seat) => {
          const categoryId = seat.seat.seatCategoryId;
          const categoryName = seat.seat.seatCategory.name;

          // Update category map
          if (!categoryMap.has(categoryId)) {
            categoryMap.set(categoryId, {
              categoryId,
              categoryName,
              seatCount: 0,
              totalAmount: 0,
              pricePerSeat: seat.amount,
            });
          }

          const category = categoryMap.get(categoryId)!;
          category.seatCount += 1;
          category.totalAmount += seat.amount;

          return {
            seatId: seat.seatId,
            categoryId: categoryId,
            categoryName: categoryName,
            rowNumber: seat.seat.rowNumber,
            seatNumber: seat.seatNumber,
            amount: seat.amount,
          };
        });

        const categoryAmounts = Array.from(categoryMap.values());

        return {
          id: item.id,
          bookingTime: item.bookingTime,
          totalSeatAmount: item.totalAmount - item.serviceCharge,
          serviceAmount: item.serviceCharge,
          payableAmount: item.totalAmount,
          paymentStatus: item.paymentStatus,
          show: {
            id: item.show.id,
            startTime: item.show.startTime,
            movieTitle: item.show.movie.title,
            theaterName: item.show.theater.name,
          },
          seats: transformedSeats,
          categoryAmounts: categoryAmounts,
        };
      }),
      totalPages,
      totalCount: total,
      currentPage: page,
      limit,
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

    const isCheckoutEvent = event.type.startsWith('checkout.session.');
    const isPaymentIntentEvent = event.type.startsWith('payment_intent.');

    if (!isCheckoutEvent && !isPaymentIntentEvent) {
      return { received: true };
    }

    let stripeId = '';
    let status = '';

    if (isCheckoutEvent) {
      const session = event.data.object as Stripe.Checkout.Session;
      stripeId = session.id;
      status =
        session.payment_status === 'paid'
          ? 'succeeded'
          : (session.status ?? 'requires_payment_method');
    } else {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      stripeId = paymentIntent.id;
      status = paymentIntent.status;
    }

    const storedPaymentIntent =
      await this.paymentIntentRepository.findByStripePaymentIntentId(stripeId);

    if (!storedPaymentIntent) {
      // For checkout, we might need to find by payment_intent ID if it was converted
      if (isPaymentIntentEvent) {
        // We probably don't have it mapped if we only stored session ID
        // But if we handle checkout.session.completed, we should be fine.
      }
      return { received: true };
    }

    const booking = await this.bookingRepository.findByIdWithSeats(
      storedPaymentIntent.bookingId,
    );

    if (!booking) {
      return { received: true };
    }

    const mappedStatus = this.mapStripeStatus(status);
    await this.paymentIntentRepository.updateStatus(
      stripeId,
      mappedStatus,
      event.data.object as unknown as Record<string, unknown>,
    );

    if (booking.paymentStatus !== PaymentStatus.PENDING) {
      return { received: true };
    }

    const isExpired = booking.expiresAt.getTime() <= Date.now();
    const isSuccess =
      event.type === 'payment_intent.succeeded' ||
      event.type === 'checkout.session.completed';

    if (isSuccess) {
      if (isExpired) {
        const conflictingSeats =
          await this.bookingRepository.findConflictingSeats(
            booking.showId,
            booking.seats.map((s) => ({
              seatId: s.seatId!,
              seatNumber: s.seatNumber,
            })),
            booking.userId,
          );

        if (conflictingSeats.length > 0) {
          // Seats are no longer available, trigger refund
          if (isPaymentIntentEvent) {
            await stripe.refunds.create({
              payment_intent: stripeId,
              reason: 'requested_by_customer',
              metadata: {
                bookingId: booking.id,
                reason: 'Booking expired and seats taken',
              },
            });
          } else {
            const session = event.data.object as Stripe.Checkout.Session;
            if (session.payment_intent) {
              await stripe.refunds.create({
                payment_intent: session.payment_intent as string,
                reason: 'requested_by_customer',
                metadata: {
                  bookingId: booking.id,
                  reason: 'Booking expired and seats taken',
                },
              });
            }
          }

          await this.bookingRepository.updatePaymentStatusAndSeats(
            booking.id,
            PaymentStatus.REFUNDED,
            BookingStatus.CANCELLED,
          );
          return { received: true };
        }
      }

      // Either not expired, or expired but seats are still available
      await this.bookingRepository.updatePaymentStatusAndSeats(
        booking.id,
        PaymentStatus.PAID,
        BookingStatus.CONFIRMED,
      );
      return { received: true };
    }

    const isFailure =
      event.type === 'payment_intent.payment_failed' ||
      event.type === 'payment_intent.canceled' ||
      event.type === 'checkout.session.expired';

    if (isFailure || isExpired) {
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
