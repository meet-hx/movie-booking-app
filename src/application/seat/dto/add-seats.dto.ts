import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SeatRowDto } from '../../theater/dto/create-theater.dto';

export class AddSeatCategoryDto {
  @ApiProperty({ example: 'category-id' })
  @IsString()
  categoryId: string;

  @ApiProperty({ type: [SeatRowDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeatRowDto)
  seats: SeatRowDto[];
}

export class AddSeatsRequestDto {
  @ApiProperty({ example: 'screen-id' })
  @IsString()
  theaterScreenId: string;

  @ApiProperty({ type: [AddSeatCategoryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddSeatCategoryDto)
  seatCategories: AddSeatCategoryDto[];
}
