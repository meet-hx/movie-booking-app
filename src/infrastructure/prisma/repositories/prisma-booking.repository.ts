import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  BookingRepository,
  CreateBookingPayload,
} from '../../../domain/repositories/booking.repository';
import { Booking } from '../../../domain/entities/booking';

@Injectable()
export class PrismaBookingRepository implements BookingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreateBookingPayload): Promise<Booking> {
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
      seats: booking.seats.map((seat) => ({
        seatId: seat.seatId,
        amount: seat.amount.toNumber(),
        bookingStatus: seat.bookingStatus,
      })),
    };
  }
}
