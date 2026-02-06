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

    const uniqueSelections = new Set<string>();
    for (const seat of request.seats) {
      const key = `${seat.row}-${seat.seatNo}`;
      if (uniqueSelections.has(key)) {
        throw new BadRequestException(Strings.booking.duplicateSeatSelection);
      }
      uniqueSelections.add(key);
    }

    const seatSelections = await Promise.all(
      request.seats.map(async (seat) => {
        const seatMatch =
          await this.seatService.findSeatByRowAndSeatNumber(
            show.theaterScreenId,
            seat.row,
            seat.seatNo,
          );

        if (!seatMatch) {
          throw new NotFoundException(
            Strings.booking.seatNotFound({
              rowNumber: seat.row,
              seatNumber: seat.seatNo,
            }),
          );
        }

        return {
          ...seat,
          seatId: seatMatch.id,
          categoryId: seatMatch.seatCategory.id,
          categoryName: seatMatch.seatCategory.name,
          additionalPrice: seatMatch.seatCategory.additionalPrice,
        };
      }),
    );

    const seatIds = seatSelections.map((seat) => seat.seatId);
    const bookedSeatIds = await this.bookingRepository.findBookedSeatIds(
      request.showId,
      seatIds,
    );

    if (bookedSeatIds.length > 0) {
      throw new ConflictException(Strings.booking.seatAlreadyBooked);
    }

    const basePrice = show.basePrice.toNumber();
    const seatAmounts = seatSelections.map((seat) => ({
      seatId: seat.seatId,
      amount: this.roundAmount(basePrice + seat.additionalPrice),
      bookingStatus: 'RESERVED' as const,
    }));

    const seatResponse = seatSelections.map((seat, index) => ({
      row: seat.row,
      seatNo: seat.seatNo,
      seatId: seat.seatId,
      categoryId: seat.categoryId,
      categoryName: seat.categoryName,
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

    const booking = await this.bookingRepository.create({
      userId,
      showId: request.showId,
      bookingTime: new Date(),
      totalAmount: payableAmount,
      serviceCharge: serviceAmount,
      paymentStatus: 'PENDING',
      seats: seatAmounts,
    });

    return {
      bookingIntentId: booking.id,
      showId: booking.showId,
      basePrice,
      seats: seatResponse,
      categoryAmounts: Array.from(categoryMap.values()),
      totalSeatAmount,
      serviceAmount,
      payableAmount,
    };
  }

  private roundAmount(amount: number): number {
    return Number(amount.toFixed(2));
  }
}
