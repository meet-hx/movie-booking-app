import { Show } from '@prisma/client';

export interface CreateShowData {
  movieId: string;
  theaterId: string;
  theaterScreenId: string;
  startTime: Date;
  endTime: Date;
  basePrice: number;
}

export interface ShowFilters {
  date?: Date;
  theaterId?: string;
  movieId?: string;
}

export interface ShowRepository {
  findById(id: string): Promise<Show | null>;
  getPricingContext(showId: string, seatIds: string[]): Promise<any | null>;
  create(data: CreateShowData): Promise<Show>;
  findAll(filters: ShowFilters): Promise<Show[]>;
  findOverlappingShow(
    theaterScreenId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<Show | null>;
}
