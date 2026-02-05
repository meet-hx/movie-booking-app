import { Movie } from '@prisma/client';

export interface MovieRepository {
  findById(id: string): Promise<Movie | null>;
  exists(id: string): Promise<boolean>;
}
