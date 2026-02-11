import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreatePaymentIntentRequestDto {
  @ApiProperty({
    description: 'Currency for the payment intent',
    example: 'inr',
    required: false,
  })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({
    description: 'URL to redirect to after successful payment',
    example: 'https://example.com/success',
    required: true,
  })
  @IsString()
  successUrl: string;

  @ApiProperty({
    description: 'URL to redirect to after cancelled payment',
    example: 'https://example.com/cancel',
    required: true,
  })
  @IsString()
  cancelUrl: string;
}

export class CreatePaymentIntentResponseDto {
  @ApiProperty({
    description: 'Booking intent identifier',
    example: '123e4567-e89b-12d3-a456-426614174030',
  })
  bookingIntentId: string;

  @ApiProperty({
    description: 'Stripe checkout session URL',
    example: 'https://checkout.stripe.com/pay/cs_test_...',
  })
  checkoutUrl: string;

  @ApiProperty({
    description: 'Stripe payment intent identifier',
    example: 'pi_3QxYvQ2eZvKYlo2C1uJq4L1o',
    required: false,
  })
  @IsOptional()
  paymentIntentId?: string;

  @ApiProperty({
    description: 'Stripe client secret for confirming payment (if applicable)',
    example: 'pi_3QxYvQ2eZvKYlo2C1uJq4L1o_secret_abc123',
    required: false,
  })
  @IsOptional()
  clientSecret?: string;

  @ApiProperty({
    description: 'Total payable amount for the booking intent',
    example: 945,
  })
  amount: number;

  @ApiProperty({
    description: 'Currency used for the payment intent',
    example: 'inr',
  })
  currency: string;

  @ApiProperty({
    description: 'Booking intent expiry timestamp',
    example: '2024-01-15T10:45:00.000Z',
  })
  expiresAt: Date;
}
