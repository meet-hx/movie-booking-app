import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TheaterScreenDto } from '../../theater/dto/create-theater.dto';

export class AddTheaterScreensRequestDto {
  @ApiProperty({ example: 'theater-id' })
  @IsString()
  theaterId: string;

  @ApiProperty({ type: [TheaterScreenDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TheaterScreenDto)
  screens: TheaterScreenDto[];
}
