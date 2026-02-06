import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SeatSelectionRequestDto {
  @ApiProperty({
    description: 'Seat row identifier',
    example: 'A',
  })
  @IsString()
  @IsNotEmpty()
  row: string;

  @ApiProperty({
    description: 'Seat number within the row',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  seatNo: number;
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
    description: 'Selected seats',
    type: [SeatSelectionRequestDto],
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SeatSelectionRequestDto)
  seats: SeatSelectionRequestDto[];
}

export class BookingIntentSeatResponseDto {
  @ApiProperty({ description: 'Seat row identifier', example: 'A' })
  row: string;

  @ApiProperty({ description: 'Seat number within the row', example: 1 })
  seatNo: number;

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
}
