import { BookingSeat, PaymentStatus } from 'src/generated/prisma/client';

export interface CreateBookingResponseDto {
  userId: string;
  showId: string;
  bookingTime: Date;
  totalAmount: number;
  serviceCharge: number;
  paymentStatus: PaymentStatus;
  seats: BookingSeat[];
}
