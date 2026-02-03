import { Movie } from '../entities/movie';

export interface MovieRepository {
  findById(id: string): Promise<Movie | null>;
  exists(id: string): Promise<boolean>;
}
