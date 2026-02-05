import { ApiProperty } from '@nestjs/swagger';

export class TheaterScreenResponseDto {
  @ApiProperty({ example: 'screen-id' })
  id: string;

  @ApiProperty({ example: 'theater-id' })
  theaterId: string;

  @ApiProperty({ example: 1 })
  screenNo: number;

  @ApiProperty({ example: 120 })
  totalSeats: number;

  @ApiProperty({ example: true })
  isAvailable: boolean;
}
