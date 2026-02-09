import { BookingStatus, PaymentStatus } from 'src/generated/prisma/client';

export interface BookingHistoryResult {
  id: string;
  bookingTime: Date;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  show: {
    id: string;
    startTime: Date;
    movie: {
      title: string;
    };
    theater: {
      name: string;
    };
  };
  seats: {
    seatNumber: number;
    amount: number;
    bookingStatus: BookingStatus;
    seat: {
      rowNumber: string;
    };
  }[];
}
