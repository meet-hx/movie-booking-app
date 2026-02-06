import {
  CreatePaymentIntentPayload,
  CreatePaymentIntentResult,
} from './createPaymentIntent';
import { PaymentIntentStatus } from 'src/generated/prisma/client';

export interface PaymentIntentRepository {
  create(payload: CreatePaymentIntentPayload): Promise<CreatePaymentIntentResult>;
  findByBookingId(bookingId: string): Promise<CreatePaymentIntentResult | null>;
  findByStripePaymentIntentId(
    stripePaymentIntentId: string,
  ): Promise<CreatePaymentIntentResult | null>;
  updateStatus(
    stripePaymentIntentId: string,
    status: PaymentIntentStatus,
    rawEvent?: Record<string, unknown> | null,
  ): Promise<void>;
}
