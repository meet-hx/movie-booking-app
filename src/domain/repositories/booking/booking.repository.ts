import { BookingStatus, PaymentStatus } from 'src/generated/prisma/client';
import { CreateBookingPayload, CreateBookingResult } from './createBooking';

export interface BookingRepository {
  create(payload: CreateBookingPayload): Promise<CreateBookingResult>;
  findConflictingSeats(
    showId: string,
    seatSelections: { seatId: string; seatNumber: number }[],
    userId: string,
  ): Promise<{ seatId: string; seatNumber: number }[]>;
  findByIdWithSeats(id: string): Promise<CreateBookingResult | null>;
  updatePaymentStatusAndSeats(
    bookingId: string,
    paymentStatus: PaymentStatus,
    seatStatus: BookingStatus,
  ): Promise<void>;
}
