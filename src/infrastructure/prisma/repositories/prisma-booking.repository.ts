import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { BookingRepository } from '../../../domain/repositories/booking/booking.repository';
import {
  CreateBookingPayload,
  CreateBookingResult,
} from '../../../domain/repositories/booking/createBooking';

@Injectable()
export class PrismaBookingRepository implements BookingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreateBookingPayload): Promise<CreateBookingResult> {
    const booking = await this.prisma.booking.create({
      data: {
        userId: payload.userId,
        showId: payload.showId,
        bookingTime: payload.bookingTime,
        totalAmount: payload.totalAmount,
        serviceCharge: payload.serviceCharge,
        paymentStatus: payload.paymentStatus,
        seats: {
          createMany: {
            data: payload.seats.map((seat) => ({
              seatId: seat.seatId,
              amount: seat.amount,
              bookingStatus: seat.bookingStatus,
            })),
          },
        },
      },
      include: {
        seats: true,
      },
    });

    return {
      id: booking.id,
      userId: booking.userId,
      showId: booking.showId,
      bookingTime: booking.bookingTime,
      totalAmount: booking.totalAmount.toNumber(),
      serviceCharge: booking.serviceCharge.toNumber(),
      paymentStatus: booking.paymentStatus,
      seats: booking.seats,
    };
  }
}
