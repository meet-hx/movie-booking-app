import { Booking, BookingSeat, PaymentStatus } from '../entities/booking';

export interface CreateBookingPayload {
  userId: string;
  showId: string;
  bookingTime: Date;
  totalAmount: number;
  serviceCharge: number;
  paymentStatus: PaymentStatus;
  seats: BookingSeat[];
}

export interface BookingRepository {
  create(payload: CreateBookingPayload): Promise<Booking>;
}
