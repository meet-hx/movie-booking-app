import { ApiProperty } from '@nestjs/swagger';

export class SeatCategoryResponseDto {
  @ApiProperty({ example: 'category-id' })
  id: string;

  @ApiProperty({ example: 'Gold' })
  name: string;

  @ApiProperty({ example: 'Premium seats' })
  description: string | null;

  @ApiProperty({ example: 150 })
  additionalPrice: number;

  @ApiProperty({ example: 'screen-id' })
  theaterScreenId: string;
}
