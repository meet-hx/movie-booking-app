import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SeatSelectionDto {
  @ApiProperty({ description: 'Seat row identifier', example: 'A' })
  @IsString()
  @IsNotEmpty()
  row: string;

  @ApiProperty({ description: 'Seat number', example: '1' })
  @IsString()
  @IsNotEmpty()
  seatNo: string;
}

export class CreateBookingIntentRequestDto {
  @ApiProperty({
    description: 'Show identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID()
  showId: string;

  @ApiProperty({
    description: 'Theater screen identifier',
    example: '123e4567-e89b-12d3-a456-426614174111',
    format: 'uuid',
  })
  @IsUUID()
  screenId: string;

  @ApiProperty({
    description: 'Selected seats',
    type: [SeatSelectionDto],
    isArray: true,
    example: [
      { row: 'A', seatNo: '1' },
      { row: 'A', seatNo: '2' },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SeatSelectionDto)
  seats: SeatSelectionDto[];
}

export class BookingIntentSeatResponseDto {
  @ApiProperty({
    description: 'Screen seat identifier',
    example: '123e4567-e89b-12d3-a456-426614174010',
  })
  seatId: string;

  @ApiProperty({
    description: 'Seat category identifier',
    example: '123e4567-e89b-12d3-a456-426614174020',
  })
  categoryId: string;

  @ApiProperty({ description: 'Seat category name', example: 'Gold' })
  categoryName: string;

  @ApiProperty({ description: 'Seat row identifier', example: 'A' })
  rowNumber: string;

  @ApiProperty({ description: 'Seat numbers for the seat group', example: [1] })
  seatNumbers: number[];

  @ApiProperty({
    description: 'Price for this seat (base + category additional)',
    example: 350,
  })
  amount: number;
}

export class BookingIntentCategoryAmountResponseDto {
  @ApiProperty({
    description: 'Seat category identifier',
    example: '123e4567-e89b-12d3-a456-426614174020',
  })
  categoryId: string;

  @ApiProperty({ description: 'Seat category name', example: 'Gold' })
  categoryName: string;

  @ApiProperty({ description: 'Number of seats in this category', example: 2 })
  seatCount: number;

  @ApiProperty({
    description: 'Price per seat in this category',
    example: 350,
  })
  pricePerSeat: number;

  @ApiProperty({
    description: 'Total amount for this category',
    example: 700,
  })
  totalAmount: number;
}

export class CreateBookingIntentResponseDto {
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

  @ApiProperty({ description: 'Base price for the show', example: 250 })
  basePrice: number;

  @ApiProperty({
    description: 'Screen identifier for the booking intent',
    example: '123e4567-e89b-12d3-a456-426614174111',
  })
  screenId: string;

  @ApiProperty({
    description: 'Selected seats with pricing details',
    type: [BookingIntentSeatResponseDto],
    isArray: true,
  })
  seats: BookingIntentSeatResponseDto[];

  @ApiProperty({
    description: 'Category-wise pricing breakdown',
    type: [BookingIntentCategoryAmountResponseDto],
    isArray: true,
  })
  categoryAmounts: BookingIntentCategoryAmountResponseDto[];

  @ApiProperty({
    description: 'Total seat amount (sum of category totals)',
    example: 900,
  })
  totalSeatAmount: number;

  @ApiProperty({
    description: 'Service amount (5% of total seat amount)',
    example: 45,
  })
  serviceAmount: number;

  @ApiProperty({
    description: 'Final payable amount (total seat amount + service amount)',
    example: 945,
  })
  payableAmount: number;

  @ApiProperty({
    description: 'Booking intent expiry timestamp',
    example: '2024-01-15T10:45:00.000Z',
  })
  expiresAt: Date;
}
