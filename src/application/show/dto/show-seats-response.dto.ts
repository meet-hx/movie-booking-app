import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ShowSeatsRequestDto {
  @ApiProperty({
    description: 'The ID of the show',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  showId: string;
}

export class ShowSeatColumnDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: true })
  isAvailable: boolean;
}

export class ShowSeatRowDto {
  @ApiProperty({ example: 'A' })
  row: string;

  @ApiProperty({ type: [ShowSeatColumnDto] })
  columns: ShowSeatColumnDto[];
}

export class ShowSeatCategoryDto {
  @ApiProperty({ example: 'Premium' })
  title: string;

  @ApiProperty({ example: 15.5 })
  price: number;

  @ApiProperty({ type: [ShowSeatRowDto] })
  rows: ShowSeatRowDto[];
}

export class ShowMovieDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  duration: number;

  @ApiProperty()
  type: string;
}

export class ShowTheaterDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  zipCode: string;

  @ApiProperty()
  country: string;
}

export class ShowDetailsDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  startTime: Date;

  @ApiProperty()
  endTime: Date;

  @ApiProperty({ type: ShowMovieDto })
  movie: ShowMovieDto;

  @ApiProperty({ type: ShowTheaterDto })
  theater: ShowTheaterDto;
}

export class ShowSeatsResponseDto {
  @ApiProperty({ type: ShowDetailsDto })
  show: ShowDetailsDto;

  @ApiProperty({ type: [ShowSeatCategoryDto] })
  categories: ShowSeatCategoryDto[];
}
