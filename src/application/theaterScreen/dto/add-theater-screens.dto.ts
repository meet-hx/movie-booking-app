import { TheaterScreenDto } from '../../theater/dto/create-theater.dto';

export interface AddTheaterScreensRequestDto {
  theaterId: string;
  screens: TheaterScreenDto[];
}
