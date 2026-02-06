import { ApiProperty } from '@nestjs/swagger';

export class StripeWebhookRequestDto {
  @ApiProperty({
    description: 'Stripe event identifier',
    example: 'evt_1QxYvQ2eZvKYlo2C4NwS0pZk',
  })
  id: string;

  @ApiProperty({
    description: 'Stripe event type',
    example: 'payment_intent.succeeded',
  })
  type: string;

  @ApiProperty({
    description: 'Stripe event payload',
    example: {},
  })
  data: Record<string, unknown>;
}

export class StripeWebhookResponseDto {
  @ApiProperty({ description: 'Acknowledgement flag', example: true })
  received: boolean;
}
