import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateScreenSeatRequestDto {
  @ApiPropertyOptional({ example: 'screen-id' })
  @IsOptional()
  @IsString()
  theaterScreenId?: string;

  @ApiPropertyOptional({ example: 'category-id' })
  @IsOptional()
  @IsString()
  seatCategoryId?: string;

  @ApiPropertyOptional({ example: 'A' })
  @IsOptional()
  @IsString()
  rowNumber?: string;

  @ApiPropertyOptional({ example: [1, 2, 3, 4, 5], type: [Number] })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  seatNumbers?: number[];
}
