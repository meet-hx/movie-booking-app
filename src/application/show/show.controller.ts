import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ShowService } from './show.service';
import {
  CreateShowRequestDto,
  CreateShowResponseDto,
} from './dto/create-show.dto';
import { ListShowsQueryDto, ShowResponseDto } from './dto/list-shows.dto';

@ApiTags('shows')
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
}
