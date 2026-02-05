import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SeatRowDto {
  @ApiProperty({ example: 'A' })
  @IsString()
  @IsNotEmpty()
  rowNumber: string;

  @ApiProperty({ example: [1, 2, 3, 4, 5], type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  seatNumbers: number[];
}

export class SeatCategoryDto {
  @ApiProperty({ example: 'Gold' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Gold seats' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  additionalPrice: number;

  @ApiProperty({ type: [SeatRowDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeatRowDto)
  seats: SeatRowDto[];
}

export class TheaterScreenDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  screenNo: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  totalSeats: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiProperty({ type: [SeatCategoryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeatCategoryDto)
  seatCategories: SeatCategoryDto[];
}

export class CreateTheaterRequestDto {
  @ApiProperty({ example: 'Cineplex' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '123 Main St' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'Mumbai' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'MH' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: '400001' })
  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @ApiProperty({ example: 'India' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: '+91-9876543210' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'info@cineplex.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'https://cineplex.com' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ type: [TheaterScreenDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TheaterScreenDto)
  screens: TheaterScreenDto[];
}

export class UpdateTheaterRequestDto {
  @ApiPropertyOptional({ example: 'Cineplex' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '123 Main St' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Mumbai' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'MH' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: '400001' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ example: 'India' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: '+91-9876543210' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'info@cineplex.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'https://cineplex.com', nullable: true })
  @IsOptional()
  @IsString()
  website?: string | null;
}

export class TheaterResponseDto {
  @ApiProperty({ example: 'e8a1e8c6-61ad-4261-a093-5e418ac992fc' })
  id: string;

  @ApiProperty({ example: 'Cineplex' })
  name: string;

  @ApiProperty({ example: '123 Main St' })
  address: string;

  @ApiProperty({ example: 'Mumbai' })
  city: string;

  @ApiProperty({ example: 'MH' })
  state: string;

  @ApiProperty({ example: '400001' })
  zipCode: string;

  @ApiProperty({ example: 'India' })
  country: string;

  @ApiProperty({ example: '+91-9876543210' })
  phone: string;

  @ApiProperty({ example: 'info@cineplex.com' })
  email: string;

  @ApiProperty({ example: 'https://cineplex.com' })
  website: string;
}
