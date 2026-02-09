import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSeatCategoryRequestDto {
  @ApiProperty({ example: 'category-id' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({ example: 'screen-id' })
  @IsOptional()
  @IsString()
  theaterScreenId?: string;

  @ApiPropertyOptional({ example: 'Gold' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Premium seats' })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({ example: 150 })
  @IsOptional()
  @IsNumber()
  additionalPrice?: number;
}
