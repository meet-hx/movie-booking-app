import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteSeatCategoryRequestDto {
  @ApiProperty({ example: 'category-id' })
  @IsString()
  @IsNotEmpty()
  id: string;
}
