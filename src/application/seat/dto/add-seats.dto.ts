import { SeatRowDto } from '../../theater/dto/create-theater.dto';

export interface AddSeatCategoryDto {
  categoryId: string;
  seats: SeatRowDto[];
}

export interface AddSeatsRequestDto {
  theaterScreenId: string;
  seatCategories: AddSeatCategoryDto[];
}
