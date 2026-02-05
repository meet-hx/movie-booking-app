import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class ListShowsByMovieQueryDto {
  @ApiProperty({
    description: 'Filter by date (YYYY-MM-DD)',
    example: '2024-02-05',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({
    description: 'Filter by Movie ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  movieId?: string;
}

export class ListShowsByTheaterQueryDto {
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
}

export class GenreSummaryDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Action' })
  name: string;
}

export class MovieShowtimesResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Inception' })
  title: string;

  @ApiProperty({ example: 'A mind-bending thriller.' })
  description: string | null;

  @ApiProperty({ example: 148 })
  duration: number;

  @ApiProperty({ example: 'IMAX' })
  type: string;

  @ApiProperty({ type: GenreSummaryDto, nullable: true })
  genre: GenreSummaryDto | null;

  @ApiProperty({
    example: ['2024-02-05T18:00:00.000Z', '2024-02-05T21:00:00.000Z'],
  })
  startTimes: Date[];
}

export class TheaterShowtimesResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Downtown Cinema' })
  name: string;

  @ApiProperty({ example: '123 Main St' })
  address: string;

  @ApiProperty({ example: 'Metropolis' })
  city: string;

  @ApiProperty({ example: 'CA' })
  state: string;

  @ApiProperty({ example: '90001' })
  zipCode: string;

  @ApiProperty({ example: 'USA' })
  country: string;

  @ApiProperty({ example: '+1-555-0100' })
  phone: string;

  @ApiProperty({ example: 'info@downtowncinema.com' })
  email: string;

  @ApiProperty({ example: 'https://downtowncinema.com', nullable: true })
  website: string | null;

  @ApiProperty({
    example: ['2024-02-05T18:00:00.000Z', '2024-02-05T21:00:00.000Z'],
  })
  startTimes: Date[];
}
