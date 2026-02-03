import { Inject, Injectable } from "@nestjs/common";
import { Booking } from "../../domain/entities/booking";
import {
  BookingRepository,
  CreateBookingSeatInput,
} from "../../domain/repositories/booking.repository";
import { ShowRepository } from "../../domain/repositories/show.repository";
import {
  BOOKING_REPOSITORY,
  SHOW_REPOSITORY,
} from "../../infrastructure/tokens/repository.tokens";

export interface BookSeatsCommand {
  userId: string;
  showId: string;
  serviceCharge: number;
  paymentStatus: string;
  seats: CreateBookingSeatInput[];
}

@Injectable()
export class BookSeatsService {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
    @Inject(SHOW_REPOSITORY)
    private readonly showRepository: ShowRepository,
  ) {}

  async execute(command: BookSeatsCommand): Promise<Booking> {
    const show = await this.showRepository.findById(command.showId);
    if (!show) {
      throw new Error("Show not found");
    }

    if (command.seats.length === 0) {
      throw new Error("At least one seat is required");
    }

    const seatsTotal = command.seats.reduce(
      (total, seat) => total + seat.amount,
      0,
    );
    const totalAmount = seatsTotal + command.serviceCharge;

    return this.bookingRepository.createBooking({
      userId: command.userId,
      showId: show.id,
      totalAmount,
      serviceCharge: command.serviceCharge,
      paymentStatus: command.paymentStatus,
      seats: command.seats,
    });
  }
}
