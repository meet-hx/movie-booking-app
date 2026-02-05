import { CreateBookingPayload, CreateBookingResult } from './createBooking';

export interface BookingRepository {
  create(payload: CreateBookingPayload): Promise<CreateBookingResult>;
}
