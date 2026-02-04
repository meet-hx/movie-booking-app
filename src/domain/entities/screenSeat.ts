import { SeatCategory } from './seatCategory';
import { TheaterScreen } from './theaterScreen';

export interface ScreenSeat {
  id: string;
  theaterScreenId: string;
  seatCategoryId: string;
  rowNumber: string;
  seatNumbers: number[];
  seatCategory: SeatCategory;
  theaterScreen: TheaterScreen;
}
