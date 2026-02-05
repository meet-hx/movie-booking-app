import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  Min,
  IsDecimal,
} from 'class-validator';

export class CreateShowRequestDto {
  @ApiProperty({
    description: 'Movie ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  movieId: string;

  @ApiProperty({
    description: 'Theater ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  theaterId: string;

  @ApiProperty({
    description: 'Theater Screen ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  theaterScreenId: string;

  @ApiProperty({
    description: 'Show start time',
    example: '2024-02-05T18:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({
    description: 'Show end time',
    example: '2024-02-05T21:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({
    description: 'Base price of the show',
    example: 250.0,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  basePrice: number;
}

export class CreateShowResponseDto {
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

  @ApiProperty({ example: '2024-02-05T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-02-05T10:00:00Z' })
  updatedAt: Date;
}
