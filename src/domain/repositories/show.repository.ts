import { Show } from "../entities/show";

export interface ShowRepository {
  findById(id: string): Promise<Show | null>;
}
