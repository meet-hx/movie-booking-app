import { Injectable } from "@nestjs/common";
import {
  BookingRepository,
  CreateBookingInput,
} from "../../domain/repositories/booking.repository";
import { Booking } from "../../domain/entities/booking";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PrismaBookingRepository implements BookingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createBooking(input: CreateBookingInput): Promise<Booking> {
    const booking = await this.prisma.$transaction(async (transaction) => {
      const createdBooking = await transaction.booking.create({
        data: {
          userId: input.userId,
          showId: input.showId,
          totalAmount: input.totalAmount,
          serviceCharge: input.serviceCharge,
          paymentStatus: input.paymentStatus,
          bookingSeats: {
            create: input.seats.map((seat) => ({
              seatId: seat.seatId,
              amount: seat.amount,
              bookingStatus: seat.bookingStatus,
            })),
          },
        },
        include: {
          bookingSeats: true,
        },
      });

      return createdBooking;
    });

    return {
      id: booking.id,
      userId: booking.userId,
      showId: booking.showId,
      bookingTime: booking.bookingTime,
      totalAmount: Number(booking.totalAmount),
      serviceCharge: Number(booking.serviceCharge),
      paymentStatus: booking.paymentStatus,
      seats: booking.bookingSeats.map((seat) => ({
        seatId: seat.seatId,
        amount: Number(seat.amount),
        bookingStatus: seat.bookingStatus,
      })),
    };
  }
}
