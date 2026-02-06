import { PaymentIntentStatus } from 'src/generated/prisma/client';

export interface CreatePaymentIntentPayload {
  bookingId: string;
  userId: string;
  stripePaymentIntentId: string;
  clientSecret: string;
  status: PaymentIntentStatus;
  amount: number;
  currency: string;
  rawEvent?: Record<string, unknown> | null;
}

export interface CreatePaymentIntentResult {
  id: string;
  bookingId: string;
  userId: string;
  stripePaymentIntentId: string;
  clientSecret: string;
  status: PaymentIntentStatus;
  amount: number;
  currency: string;
  rawEvent: Record<string, unknown> | null;
}
