import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  WebhookEventPayload,
  WebhookEventRepository,
} from '../../../domain/repositories/webhookEvent/webhook-event.repository';

@Injectable()
export class PrismaWebhookEventRepository implements WebhookEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async exists(id: string): Promise<boolean> {
    const existing = await this.prisma.webhookEvent.findUnique({
      where: { id },
      select: { id: true },
    });

    return Boolean(existing);
  }

  async create(payload: WebhookEventPayload): Promise<void> {
    await this.prisma.webhookEvent.create({
      data: {
        id: payload.id,
        type: payload.type,
        payload: payload.payload,
      },
    });
  }
}
