import { ApiProperty } from '@nestjs/swagger';
import { MovieType } from 'src/generated/prisma/client';

export class GenreResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Action' })
  name: string;
}

export class LanguageResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  id: string;

  @ApiProperty({ example: 'English' })
  name: string;
}

export class MovieLanguageResponseDto {
  @ApiProperty({ type: LanguageResponseDto })
  language: LanguageResponseDto;
}

export class MovieResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174003',
    description: 'Movie unique identifier',
  })
  id: string;

  @ApiProperty({ example: 'Inception' })
  title: string;

  @ApiProperty({
    example: 'A mind-bending thriller about dreams within dreams',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({ example: 148 })
  duration: number;

  @ApiProperty({ enum: MovieType, example: MovieType.IMAX })
  type: MovieType;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  genreId: string;

  @ApiProperty({ type: GenreResponseDto })
  genre?: GenreResponseDto;

  @ApiProperty({ type: [MovieLanguageResponseDto], isArray: true })
  languages?: MovieLanguageResponseDto[];

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  updatedAt: Date;
}
