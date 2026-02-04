import { Movie } from "./movie";
import { Theater } from "./theater";
import { TheaterScreen } from "./theaterScreen";

export interface ShowPricingContext {
  showId: string;
  basePrice: number;
  seatAdjustments: Array<{ seatId: string; additionalPrice: number }>;
}

export interface Show {
  id: string;
  movieId: string;
  theaterId: string;
  theaterScreenId: string;
  startTime: Date;
  endTime: Date;
  basePrice: number;
  movie: Movie;
  theater: Theater;
  theaterScreen: TheaterScreen;
}
