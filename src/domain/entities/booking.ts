import { Show } from './show';
import { User } from './user';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type BookingStatus = 'RESERVED' | 'CONFIRMED' | 'CANCELLED';

export interface BookingSeat {
  seatId: string;
  amount: number;
  bookingStatus: BookingStatus;
}

export interface Booking {
  id: string;
  userId: string;
  showId: string;
  bookingTime: Date;
  totalAmount: number;
  serviceCharge: number;
  paymentStatus: PaymentStatus;
  seats: BookingSeat[];
  user: User;
  show: Show;
}
