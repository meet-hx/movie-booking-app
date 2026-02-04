import { Genre } from './genre';
import { Language } from './language';

export type MovieType = 'TWO_D' | 'THREE_D' | 'FOUR_D' | 'IMAX';

export interface Movie {
  id: string;
  title: string;
  description?: string | null;
  duration: number;
  type: MovieType;
  genreId: string;
  genre: Genre;
  languages: Language[];
}
