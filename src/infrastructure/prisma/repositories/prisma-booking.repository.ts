import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { BookingRepository } from '../../../domain/repositories/booking/booking.repository';
import { BookingStatus, PaymentStatus } from 'src/generated/prisma/client';
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
        expiresAt: payload.expiresAt,
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
      expiresAt: booking.expiresAt,
      totalAmount: booking.totalAmount.toNumber(),
      serviceCharge: booking.serviceCharge.toNumber(),
      paymentStatus: booking.paymentStatus,
      seats: booking.seats,
    };
  }

  async findByIdWithSeats(id: string): Promise<CreateBookingResult | null> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        seats: true,
      },
    });

    if (!booking) {
      return null;
    }

    return {
      id: booking.id,
      userId: booking.userId,
      showId: booking.showId,
      bookingTime: booking.bookingTime,
      expiresAt: booking.expiresAt,
      totalAmount: booking.totalAmount.toNumber(),
      serviceCharge: booking.serviceCharge.toNumber(),
      paymentStatus: booking.paymentStatus,
      seats: booking.seats,
    };
  }

  async findBookedSeatIds(
    showId: string,
    seatIds: string[],
  ): Promise<string[]> {
    const bookedSeats = await this.prisma.bookingSeat.findMany({
      where: {
        seatId: { in: seatIds },
        bookingStatus: 'CONFIRMED',
        booking: {
          showId,
        },
      },
      select: {
        seatId: true,
      },
    });

    return bookedSeats.map((seat) => seat.seatId);
  }

  async updatePaymentStatusAndSeats(
    bookingId: string,
    paymentStatus: PaymentStatus,
    seatStatus: BookingStatus,
  ): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.booking.update({
        where: { id: bookingId },
        data: { paymentStatus },
      }),
      this.prisma.bookingSeat.updateMany({
        where: { bookingId },
        data: { bookingStatus: seatStatus },
      }),
    ]);
  }
}
