import { Booking } from './booking';
import { ScreenSeat } from './screenSeat';

export interface BookingSeat {
  id: string;
  bookingId: string;
  seatId: string;
  amount: number;
  bookingStatus: string;
  booking: Booking;
  seat: ScreenSeat;
}
