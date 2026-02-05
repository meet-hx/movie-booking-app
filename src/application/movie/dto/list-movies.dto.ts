import { ApiProperty } from '@nestjs/swagger';
import { MovieResponseDto } from './movie-response.dto';

export class ListMoviesResponseDto {
  @ApiProperty({ type: [MovieResponseDto], isArray: true })
  movies: MovieResponseDto[];
}
