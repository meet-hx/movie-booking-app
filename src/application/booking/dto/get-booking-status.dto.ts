import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus, PaymentStatus } from 'src/generated/prisma/client';
import { IsUUID } from 'class-validator';

export class GetBookingStatusParamsDto {
  @ApiProperty({
    description: 'Booking intent identifier',
    example: '123e4567-e89b-12d3-a456-426614174030',
    format: 'uuid',
  })
  @IsUUID()
  id: string;
}

class BookingSeatStatusResponseDto {
  @ApiProperty({
    description: 'Seat identifier',
    example: '123e4567-e89b-12d3-a456-426614174010',
  })
  seatId: string;

  @ApiProperty({ enum: BookingStatus, example: BookingStatus.CONFIRMED })
  status: BookingStatus;

  @ApiProperty({ description: 'Seat amount', example: 350 })
  amount: number;
}

export class GetBookingStatusResponseDto {
  @ApiProperty({
    description: 'Booking intent identifier',
    example: '123e4567-e89b-12d3-a456-426614174030',
  })
  bookingIntentId: string;

  @ApiProperty({
    description: 'Show identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  showId: string;

  @ApiProperty({ enum: PaymentStatus, example: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @ApiProperty({
    description: 'Booking intent expiry timestamp',
    example: '2024-01-15T10:45:00.000Z',
  })
  expiresAt: Date;

  @ApiProperty({ description: 'Total payable amount', example: 945 })
  totalAmount: number;

  @ApiProperty({ description: 'Service charge amount', example: 45 })
  serviceCharge: number;

  @ApiProperty({
    description: 'Seat statuses for the booking intent',
    type: [BookingSeatStatusResponseDto],
    isArray: true,
  })
  seats: Partial<BookingSeatStatusResponseDto>[];
}
