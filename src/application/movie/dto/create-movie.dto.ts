import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsEnum,
  IsUUID,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MovieType } from 'src/generated/prisma/client';
import { MovieResponseDto } from './movie-response.dto';

export class CreateMovieRequestDto {
  @ApiProperty({
    description: 'Movie title',
    example: 'Inception',
    minLength: 1,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'Movie description',
    example: 'A mind-bending thriller about dreams within dreams',
    required: false,
    maxLength: 1000,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    description: 'Movie duration in minutes',
    example: 148,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiProperty({
    description: 'Movie type',
    enum: MovieType,
    example: MovieType.IMAX,
  })
  @IsEnum(MovieType, {
    message: `type must be one of: ${Object.values(MovieType).join(', ')}`,
  })
  type: MovieType;

  @ApiProperty({
    description: 'Genre ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsNotEmpty()
  genreId: string;
}

export class CreateMovieResponseDto extends MovieResponseDto {}
