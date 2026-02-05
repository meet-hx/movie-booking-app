import { Genre } from '@prisma/client';

export interface GenreRepository {
  findById(id: string): Promise<Genre | null>;
  exists(id: string): Promise<boolean>;
}
