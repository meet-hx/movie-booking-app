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
import type {
  CreateTheaterRequestDto,
  UpdateTheaterRequestDto,
} from './dto/create-theater.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Theaters')
@Controller('theaters')
export class TheaterController {
  constructor(private readonly theaterService: TheaterService) {}

  @Post()
  @ApiOperation({ summary: 'Create a theater with screens and seats' })
  @ApiResponse({ status: 201, description: 'Theater created successfully' })
  createTheater(@Body() request: CreateTheaterRequestDto) {
    return this.theaterService.createTheater(request);
  }

  @Get()
  @ApiOperation({ summary: 'List all theaters' })
  @ApiResponse({ status: 200, description: 'Theaters retrieved successfully' })
  listTheaters() {
    return this.theaterService.listTheaters();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a theater by id' })
  @ApiResponse({ status: 200, description: 'Theater retrieved successfully' })
  getTheater(@Param('id') id: string) {
    return this.theaterService.getTheater(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a theater' })
  @ApiResponse({ status: 200, description: 'Theater updated successfully' })
  updateTheater(
    @Param('id') id: string,
    @Body() request: UpdateTheaterRequestDto,
  ) {
    return this.theaterService.updateTheater(id, request);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a theater' })
  @ApiResponse({ status: 200, description: 'Theater deleted successfully' })
  deleteTheater(@Param('id') id: string) {
    return this.theaterService.deleteTheater(id);
  }
}
