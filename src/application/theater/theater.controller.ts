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

@Controller('theaters')
export class TheaterController {
  constructor(private readonly theaterService: TheaterService) {}

  @Post()
  createTheater(@Body() request: CreateTheaterRequestDto) {
    return this.theaterService.createTheater(request);
  }

  @Get()
  listTheaters() {
    return this.theaterService.listTheaters();
  }

  @Get(':id')
  getTheater(@Param('id') id: string) {
    return this.theaterService.getTheater(id);
  }

  @Patch(':id')
  updateTheater(
    @Param('id') id: string,
    @Body() request: UpdateTheaterRequestDto,
  ) {
    return this.theaterService.updateTheater(id, request);
  }

  @Delete(':id')
  deleteTheater(@Param('id') id: string) {
    return this.theaterService.deleteTheater(id);
  }
}
