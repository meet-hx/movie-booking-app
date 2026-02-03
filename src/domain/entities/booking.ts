export interface BookingSeat {
  seatId: string;
  amount: number;
  bookingStatus: string;
}

export interface Booking {
  id: string;
  userId: string;
  showId: string;
  bookingTime: Date;
  totalAmount: number;
  serviceCharge: number;
  paymentStatus: string;
  seats: BookingSeat[];
}
