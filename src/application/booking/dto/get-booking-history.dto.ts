import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class BookingHistoryRequestDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}

export class BookingHistoryShowDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  startTime: Date;

  @ApiProperty()
  movieTitle: string;

  @ApiProperty()
  theaterName: string;
}

export class BookingHistorySeatDto {
  @ApiProperty()
  seatLabel: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  status: string;
}

export class BookingHistoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  bookingTime: Date;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  paymentStatus: string;

  @ApiProperty({ type: BookingHistoryShowDto })
  show: BookingHistoryShowDto;

  @ApiProperty({ type: [BookingHistorySeatDto] })
  seats: BookingHistorySeatDto[];
}

export class PaginatedBookingHistoryResponseDto {
  @ApiProperty({ type: [BookingHistoryResponseDto] })
  docs: BookingHistoryResponseDto[];

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  limit: number;
}
