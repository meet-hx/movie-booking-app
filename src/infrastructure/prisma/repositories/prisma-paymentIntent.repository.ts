import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PaymentIntentRepository } from '../../../domain/repositories/paymentIntent/payment-intent.repository';
import {
  CreatePaymentIntentPayload,
  CreatePaymentIntentResult,
} from '../../../domain/repositories/paymentIntent/createPaymentIntent';
import { PaymentIntentStatus } from 'src/generated/prisma/client';

@Injectable()
export class PrismaPaymentIntentRepository implements PaymentIntentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    payload: CreatePaymentIntentPayload,
  ): Promise<CreatePaymentIntentResult> {
    const paymentIntent = await this.prisma.paymentIntent.create({
      data: {
        bookingId: payload.bookingId,
        userId: payload.userId,
        stripePaymentIntentId: payload.stripePaymentIntentId,
        clientSecret: payload.clientSecret,
        status: payload.status,
        amount: payload.amount,
        currency: payload.currency,
        rawEvent: payload.rawEvent ?? undefined,
      },
    });

    return {
      id: paymentIntent.id,
      bookingId: paymentIntent.bookingId,
      userId: paymentIntent.userId,
      stripePaymentIntentId: paymentIntent.stripePaymentIntentId,
      clientSecret: paymentIntent.clientSecret,
      status: paymentIntent.status,
      amount: paymentIntent.amount.toNumber(),
      currency: paymentIntent.currency,
      rawEvent: (paymentIntent.rawEvent as Record<string, unknown>) ?? null,
    };
  }

  async findByBookingId(
    bookingId: string,
  ): Promise<CreatePaymentIntentResult | null> {
    const paymentIntent = await this.prisma.paymentIntent.findFirst({
      where: { bookingId },
    });

    if (!paymentIntent) {
      return null;
    }

    return {
      id: paymentIntent.id,
      bookingId: paymentIntent.bookingId,
      userId: paymentIntent.userId,
      stripePaymentIntentId: paymentIntent.stripePaymentIntentId,
      clientSecret: paymentIntent.clientSecret,
      status: paymentIntent.status,
      amount: paymentIntent.amount.toNumber(),
      currency: paymentIntent.currency,
      rawEvent: (paymentIntent.rawEvent as Record<string, unknown>) ?? null,
    };
  }

  async findByStripePaymentIntentId(
    stripePaymentIntentId: string,
  ): Promise<CreatePaymentIntentResult | null> {
    const paymentIntent = await this.prisma.paymentIntent.findUnique({
      where: { stripePaymentIntentId },
    });

    if (!paymentIntent) {
      return null;
    }

    return {
      id: paymentIntent.id,
      bookingId: paymentIntent.bookingId,
      userId: paymentIntent.userId,
      stripePaymentIntentId: paymentIntent.stripePaymentIntentId,
      clientSecret: paymentIntent.clientSecret,
      status: paymentIntent.status,
      amount: paymentIntent.amount.toNumber(),
      currency: paymentIntent.currency,
      rawEvent: (paymentIntent.rawEvent as Record<string, unknown>) ?? null,
    };
  }

  async updateStatus(
    stripePaymentIntentId: string,
    status: PaymentIntentStatus,
    rawEvent?: Record<string, unknown> | null,
  ): Promise<void> {
    await this.prisma.paymentIntent.update({
      where: { stripePaymentIntentId },
      data: {
        status,
        rawEvent: rawEvent ?? undefined,
      },
    });
  }
}
