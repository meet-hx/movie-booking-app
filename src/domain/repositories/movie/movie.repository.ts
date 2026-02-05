import { Movie } from "src/generated/prisma/client";
import { MovieType } from "src/generated/prisma/enums";

export interface CreateMovieData {
  title: string;
  description?: string;
  duration: number;
  type: MovieType;
  genreId: string;
}

export interface UpdateMovieData {
  title?: string;
  description?: string;
  duration?: number;
  type?: MovieType;
  genreId?: string;
}

export interface MovieRepository {
  findById(id: string): Promise<Movie | null>;
  findByTitle(title: string): Promise<Movie | null>;
  exists(id: string): Promise<boolean>;
  create(data: CreateMovieData): Promise<Movie>;
  update(id: string, data: UpdateMovieData): Promise<Movie>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Movie[]>;
}
