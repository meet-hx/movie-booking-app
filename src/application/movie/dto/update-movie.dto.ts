import { PartialType } from '@nestjs/swagger';
import { CreateMovieRequestDto } from './create-movie.dto';
import { MovieResponseDto } from './movie-response.dto';

export class UpdateMovieRequestDto extends PartialType(CreateMovieRequestDto) {}

export class UpdateMovieResponseDto extends MovieResponseDto {}
