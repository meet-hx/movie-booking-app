import { Booking } from "../entities/booking";

export interface CreateBookingSeatInput {
  seatId: string;
  amount: number;
  bookingStatus: string;
}

export interface CreateBookingInput {
  userId: string;
  showId: string;
  totalAmount: number;
  serviceCharge: number;
  paymentStatus: string;
  seats: CreateBookingSeatInput[];
}

export interface BookingRepository {
  createBooking(input: CreateBookingInput): Promise<Booking>;
}
