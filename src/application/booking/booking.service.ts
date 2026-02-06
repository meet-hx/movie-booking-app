import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { BookingRepository } from '../../domain/repositories/booking/booking.repository';
import { REPOSITORY_TOKENS } from '../../infrastructure/persistence/tokens';
import { ShowService } from '../show/show.service';
import {
  CreateBookingIntentRequestDto,
  CreateBookingIntentResponseDto,
} from './dto/create-booking-intent.dto';
import { Strings } from '../../utils/strings';
import { SeatService } from '../seat/seat.service';

@Injectable()
export class BookingService {
  private static readonly SERVICE_CHARGE_RATE = 0.05;
  private static readonly HOLD_MINUTES = 10;

  constructor(
    @Inject(REPOSITORY_TOKENS.BookingRepository)
    private readonly bookingRepository: BookingRepository,
    private readonly showService: ShowService,
    private readonly seatService: SeatService,
  ) {}

  async createBookingIntent(
    request: CreateBookingIntentRequestDto,
    userId: string,
  ): Promise<CreateBookingIntentResponseDto> {
    const show = await this.showService.findById(request.showId);
    if (!show) {
      throw new NotFoundException(Strings.show.notFound);
    }

    if (show.theaterScreenId !== request.screenId) {
      throw new BadRequestException(Strings.theaterScreen.mismatch);
    }

    const uniqueSelections = new Set<string>();
    for (const seatId of request.seatIds) {
      if (uniqueSelections.has(seatId)) {
        throw new BadRequestException(Strings.booking.duplicateSeatSelection);
      }
      uniqueSelections.add(seatId);
    }

    const seatSelections = await this.seatService.findSeatDetailsByIds(
      request.screenId,
      request.seatIds,
    );

    const seatSelectionMap = new Map(
      seatSelections.map((seat) => [seat.id, seat]),
    );
    const orderedSelections = request.seatIds.map((seatId) => {
      const seat = seatSelectionMap.get(seatId);
      if (!seat) {
        throw new NotFoundException(Strings.screenSeat.notFound);
      }
      return seat;
    });

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
      amount: this.roundAmount(
        basePrice + seat.seatCategory.additionalPrice,
      ),
      bookingStatus: 'RESERVED' as const,
    }));

    const seatResponse = orderedSelections.map((seat, index) => ({
      seatId: seat.id,
      categoryId: seat.seatCategory.id,
      categoryName: seat.seatCategory.name,
      rowNumber: seat.rowNumber,
      seatNumbers: seat.seatNumbers,
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
      paymentStatus: 'PENDING',
      seats: seatAmounts,
    });

    return {
      bookingIntentId: booking.id,
      showId: booking.showId,
      basePrice,
      screenId: request.screenId,
      seats: seatResponse,
      categoryAmounts: Array.from(categoryMap.values()),
      totalSeatAmount,
      serviceAmount,
      payableAmount,
      expiresAt: booking.expiresAt,
    };
  }

  private roundAmount(amount: number): number {
    return Number(amount.toFixed(2));
  }
}
