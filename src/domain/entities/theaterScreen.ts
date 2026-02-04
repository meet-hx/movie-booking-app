import { Theater } from './theater';

export interface TheaterScreen {
  id: string;
  theaterId: string;
  screenNo: string;
  totalSeats: number;
  isAvailable: boolean;
  theater: Theater;
}
