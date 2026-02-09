import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSeatCategoryRequestDto {
  @ApiProperty({ example: 'screen-id' })
  @IsString()
  @IsNotEmpty()
  theaterScreenId: string;

  @ApiProperty({ example: 'Gold' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Premium seats' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 150 })
  @IsNumber()
  additionalPrice: number;
}
