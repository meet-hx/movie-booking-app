import { CreateBookingPayload, CreateBookingResult } from './createBooking';

export interface BookingRepository {
  create(payload: CreateBookingPayload): Promise<CreateBookingResult>;
  findBookedSeatIds(showId: string, seatIds: string[]): Promise<string[]>;
}
