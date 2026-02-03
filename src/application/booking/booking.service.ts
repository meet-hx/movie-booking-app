import { Inject, Injectable } from '@nestjs/common';
import { BookingRepository } from '../../domain/repositories/booking.repository';
import { ShowRepository } from '../../domain/repositories/show.repository';
import { BookSeatsCommand } from './dto/book-seats.command';
import { Booking } from '../../domain/entities/booking';
import { REPOSITORY_TOKENS } from '../../infrastructure/persistence/tokens';

@Injectable()
export class BookingService {
  constructor(
    @Inject(REPOSITORY_TOKENS.BookingRepository)
    private readonly bookingRepository: BookingRepository,
    @Inject(REPOSITORY_TOKENS.ShowRepository)
    private readonly showRepository: ShowRepository,
  ) {}

  async bookSeats(command: BookSeatsCommand): Promise<Booking> {
    const pricingContext = await this.showRepository.getPricingContext(
      command.showId,
      command.seatIds,
    );

    if (!pricingContext) {
      throw new Error('Show pricing context not found.');
    }

    const seatAmounts = pricingContext.seatAdjustments.map((seat) => {
      const amount = pricingContext.basePrice + seat.additionalPrice;
      return {
        seatId: seat.seatId,
        amount,
        bookingStatus: 'RESERVED' as const,
      };
    });

    const subtotal = seatAmounts.reduce((total, seat) => total + seat.amount, 0);
    const totalAmount = subtotal + command.serviceCharge;

    return this.bookingRepository.create({
      userId: command.userId,
      showId: command.showId,
      bookingTime: new Date(),
      totalAmount,
      serviceCharge: command.serviceCharge,
      paymentStatus: 'PENDING',
      seats: seatAmounts,
    });
  }
}
