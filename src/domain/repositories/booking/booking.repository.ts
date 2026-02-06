import { BookingStatus, PaymentStatus } from 'src/generated/prisma/client';
import { CreateBookingPayload, CreateBookingResult } from './createBooking';

export interface BookingRepository {
  create(payload: CreateBookingPayload): Promise<CreateBookingResult>;
  findBookedSeatIds(showId: string, seatIds: string[]): Promise<string[]>;
  findByIdWithSeats(id: string): Promise<CreateBookingResult | null>;
  updatePaymentStatusAndSeats(
    bookingId: string,
    paymentStatus: PaymentStatus,
    seatStatus: BookingStatus,
  ): Promise<void>;
}
