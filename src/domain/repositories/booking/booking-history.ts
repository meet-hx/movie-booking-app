import { BookingStatus, PaymentStatus } from 'src/generated/prisma/client';

export interface BookingHistoryResult {
  id: string;
  bookingTime: Date;
  totalAmount: number;
  serviceCharge: number;
  expiresAt: Date;
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
    seatId: string;
    seatNumber: number;
    amount: number;
    bookingStatus: BookingStatus;
    seat: {
      id: string;
      rowNumber: string;
      seatCategoryId: string;
      seatCategory: {
        id: string;
        name: string;
      };
    };
  }[];
}
