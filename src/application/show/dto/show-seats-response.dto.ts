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
