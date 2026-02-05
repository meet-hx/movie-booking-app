import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsDateString } from 'class-validator';
import { Show } from '@prisma/client';

export class ListShowsQueryDto {
  @ApiProperty({
    description: 'Filter by date (YYYY-MM-DD)',
    example: '2024-02-05',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({
    description: 'Filter by Theater ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  theaterId?: string;

  @ApiProperty({
    description: 'Filter by Movie ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  movieId?: string;
}

export class ShowResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  movieId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  theaterId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  theaterScreenId: string;

  @ApiProperty({ example: '2024-02-05T18:00:00Z' })
  startTime: Date;

  @ApiProperty({ example: '2024-02-05T21:00:00Z' })
  endTime: Date;

  @ApiProperty({ example: 250.0 })
  basePrice: number;
}
