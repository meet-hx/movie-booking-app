import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { MovieService } from './movie.service';
import {
  CreateMovieRequestDto,
  CreateMovieResponseDto,
} from './dto/create-movie.dto';
import {
  UpdateMovieRequestDto,
  UpdateMovieResponseDto,
} from './dto/update-movie.dto';
import { MovieResponseDto } from './dto/movie-response.dto';
import { ListMoviesResponseDto } from './dto/list-movies.dto';

@ApiTags('Movies')
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiBody({ type: CreateMovieRequestDto })
  @ApiResponse({
    status: 201,
    description: 'The movie has been successfully created.',
    type: CreateMovieResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Movie title already exists.' })
  async create(@Body() createMovieDto: CreateMovieRequestDto) {
    return this.movieService.create(createMovieDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all movies' })
  @ApiResponse({
    status: 200,
    description: 'List of all movies.',
    type: ListMoviesResponseDto,
  })
  async findAll() {
    const movies = await this.movieService.findAll();
    return { movies };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a movie by ID' })
  @ApiResponse({
    status: 200,
    description: 'The movie found by ID.',
    type: MovieResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  async findOne(@Param('id') id: string) {
    return this.movieService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a movie' })
  @ApiBody({ type: UpdateMovieRequestDto })
  @ApiResponse({
    status: 200,
    description: 'The movie has been successfully updated.',
    type: UpdateMovieResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  @ApiResponse({ status: 409, description: 'Movie title already exists.' })
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieRequestDto,
  ) {
    return this.movieService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a movie' })
  @ApiResponse({
    status: 200,
    description: 'The movie has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  async remove(@Param('id') id: string) {
    return this.movieService.delete(id);
  }
}
