import { Show, ShowPricingContext } from '../entities/show';

export interface ShowRepository {
  findById(id: string): Promise<Show | null>;
  getPricingContext(showId: string, seatIds: string[]): Promise<ShowPricingContext | null>;
}
