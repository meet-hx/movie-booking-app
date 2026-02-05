import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TheaterService } from './theater.service';
import {
  CreateTheaterRequestDto,
  TheaterResponseDto,
  UpdateTheaterRequestDto,
} from './dto/create-theater.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Theaters')
@Controller('theaters')
export class TheaterController {
  constructor(private readonly theaterService: TheaterService) {}

  @Post()
  @ApiOperation({ summary: 'Create a theater with screens and seats' })
  @ApiBody({ type: CreateTheaterRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Theater created successfully',
    type: TheaterResponseDto,
  })
  createTheater(@Body() body: CreateTheaterRequestDto) {
    return this.theaterService.createTheater(body);
  }

  @Get()
  @ApiOperation({ summary: 'List all theaters' })
  @ApiResponse({
    status: 200,
    description: 'Theaters retrieved successfully',
    type: [TheaterResponseDto],
  })
  listTheaters() {
    return this.theaterService.listTheaters();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a theater by id' })
  @ApiResponse({
    status: 200,
    description: 'Theater retrieved successfully',
    type: TheaterResponseDto,
  })
  getTheater(@Param('id') id: string) {
    return this.theaterService.getTheater(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a theater' })
  @ApiBody({ type: UpdateTheaterRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Theater updated successfully',
    type: TheaterResponseDto,
  })
  updateTheater(
    @Param('id') id: string,
    @Body() request: UpdateTheaterRequestDto,
  ) {
    return this.theaterService.updateTheater(id, request);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a theater' })
  @ApiResponse({
    status: 200,
    description: 'Theater deleted successfully',
    type: TheaterResponseDto,
  })
  deleteTheater(@Param('id') id: string) {
    return this.theaterService.deleteTheater(id);
  }
}
