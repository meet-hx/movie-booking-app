import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ShowService } from './show.service';
import {
  CreateShowRequestDto,
  CreateShowResponseDto,
} from './dto/create-show.dto';
import { ListShowsQueryDto, ShowResponseDto } from './dto/list-shows.dto';
import {
  ListShowsByMovieQueryDto,
  ListShowsByTheaterQueryDto,
  MovieShowtimesResponseDto,
  TheaterShowtimesResponseDto,
} from './dto/show-availability.dto';

@ApiTags('Shows')
@Controller('shows')
export class ShowController {
  constructor(private readonly showService: ShowService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new show' })
  @ApiResponse({
    status: 201,
    description: 'The show has been successfully created.',
    type: CreateShowResponseDto,
  })
  async createShow(@Body() createShowDto: CreateShowRequestDto) {
    return this.showService.createShow(createShowDto);
  }

  @Get()
  @ApiOperation({ summary: 'List shows with filters' })
  @ApiResponse({
    status: 200,
    description: 'List of shows matching the criteria.',
    type: [ShowResponseDto],
  })
  async listShows(@Query() query: ListShowsQueryDto) {
    return this.showService.listShows(query);
  }

  @Get('theaters')
  @ApiOperation({
    summary: 'List theaters with showtimes filtered by movie and date',
  })
  @ApiResponse({
    status: 200,
    description: 'List of theaters and their showtimes.',
    type: [TheaterShowtimesResponseDto],
  })
  async listTheaters(@Query() query: ListShowsByMovieQueryDto) {
    return this.showService.listShowsByMovie(query);
  }

  @Get('movies')
  @ApiOperation({
    summary: 'List movies with showtimes filtered by theater and date',
  })
  @ApiResponse({
    status: 200,
    description: 'List of movies and their showtimes.',
    type: [MovieShowtimesResponseDto],
  })
  async listMovies(@Query() query: ListShowsByTheaterQueryDto) {
    return this.showService.listShowsByTheater(query);
  }
}
