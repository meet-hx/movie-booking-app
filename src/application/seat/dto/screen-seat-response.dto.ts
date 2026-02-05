import { ApiProperty } from '@nestjs/swagger';

export class ScreenSeatResponseDto {
  @ApiProperty({ example: 'seat-id' })
  id: string;

  @ApiProperty({ example: 'screen-id' })
  theaterScreenId: string;

  @ApiProperty({ example: 'category-id' })
  seatCategoryId: string;

  @ApiProperty({ example: 'A' })
  rowNumber: string;

  @ApiProperty({ example: [1, 2, 3, 4, 5], type: [Number] })
  seatNumbers: number[];
}
