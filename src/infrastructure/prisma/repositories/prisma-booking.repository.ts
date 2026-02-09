import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { BookingRepository } from '../../../domain/repositories/booking/booking.repository';
import { BookingStatus, PaymentStatus } from 'src/generated/prisma/client';
import {
  CreateBookingPayload,
  CreateBookingResult,
} from '../../../domain/repositories/booking/createBooking';
import { BookingHistoryResult } from '../../../domain/repositories/booking/booking-history';

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
              seatId: seat.seatId!,
              seatNumber: seat.seatNumber,
              amount: seat.amount!,
              bookingStatus: seat.bookingStatus!,
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

  async findByUserIdWithDetails(
    userId: string,
    skip?: number,
    take?: number,
  ): Promise<{ data: BookingHistoryResult[]; total: number }> {
    const where = {
      userId,
      paymentStatus: { not: PaymentStatus.PENDING },
    };
    const [bookings, total] = await this.prisma.$transaction([
      this.prisma.booking.findMany({
        where,
        include: {
          show: {
            include: {
              movie: true,
              theater: true,
            },
          },
          seats: {
            include: {
              seat: true,
            },
          },
        },
        orderBy: {
          bookingTime: 'desc',
        },
        skip,
        take,
      }),
      this.prisma.booking.count({
        where,
      }),
    ]);

    const data = bookings.map((booking) => ({
      id: booking.id,
      bookingTime: booking.bookingTime,
      totalAmount: booking.totalAmount.toNumber(),
      paymentStatus: booking.paymentStatus,
      show: {
        id: booking.show.id,
        startTime: booking.show.startTime,
        movie: {
          title: booking.show.movie.title,
        },
        theater: {
          name: booking.show.theater.name,
        },
      },
      seats: booking.seats.map((seat) => ({
        seatNumber: seat.seatNumber,
        amount: seat.amount.toNumber(),
        bookingStatus: seat.bookingStatus,
        seat: {
          rowNumber: seat.seat.rowNumber,
        },
      })),
    }));

    return { data, total };
  }

  async findConflictingSeats(
    showId: string,
    seatSelections: { seatId: string; seatNumber: number }[],
    userId: string,
  ): Promise<{ seatId: string; seatNumber: number }[]> {
    const now = new Date();
    const bookedSeats = await this.prisma.bookingSeat.findMany({
      where: {
        AND: [
          {
            OR: seatSelections.map((sel) => ({
              seatId: sel.seatId,
              seatNumber: sel.seatNumber,
            })),
          },
          {
            booking: {
              showId,
            },
          },
          {
            OR: [
              {
                bookingStatus: BookingStatus.CONFIRMED,
              },
              {
                bookingStatus: BookingStatus.RESERVED,
                booking: {
                  userId: { not: userId },
                  paymentStatus: PaymentStatus.PENDING,
                  expiresAt: { gt: now },
                },
              },
            ],
          },
        ],
      },
      select: {
        seatId: true,
        seatNumber: true,
      },
    });

    return bookedSeats;
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
