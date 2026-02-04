import { TheaterScreen } from "./theaterScreen";

export interface SeatCategory {
  id: string;
  name: string;
  description: string;
  additionalPrice: number;
  theaterScreenId: string;
  theaterScreen: TheaterScreen;
}
