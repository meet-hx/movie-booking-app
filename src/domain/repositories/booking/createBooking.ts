import { BookingSeat, PaymentStatus } from 'src/generated/prisma/client';

export interface CreateBookingPayload {
  userId: string;
  showId: string;
  bookingTime: Date;
  expiresAt: Date;
  totalAmount: number;
  serviceCharge: number;
  paymentStatus: PaymentStatus;
  seats: BookingSeat[];
}

export interface CreateBookingResult {
  id: string;
  userId: string;
  showId: string;
  bookingTime: Date;
  expiresAt: Date;
  totalAmount: number;
  serviceCharge: number;
  paymentStatus: PaymentStatus;
  seats: BookingSeat[];
}
