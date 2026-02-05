import { Show } from '@prisma/client';

export interface ShowRepository {
  findById(id: string): Promise<Show | null>;
  getPricingContext(showId: string, seatIds: string[]): Promise<any | null>;
}
