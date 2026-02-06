import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TheaterScreenService } from './theater-screen.service';
import { AddTheaterScreensRequestDto } from './dto/add-theater-screens.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TheaterScreenResponseDto } from './dto/theater-screen-response.dto';
import { UpdateTheaterScreenRequestDto } from './dto/update-theater-screen.dto';

@ApiTags('Theater Screens')
@Controller('theater-screens')
export class TheaterScreenController {
  constructor(private readonly theaterScreenService: TheaterScreenService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add screens to a theater' })
  @ApiBody({ type: AddTheaterScreensRequestDto })
  @ApiResponse({ status: 201, description: 'Screens added successfully' })
  addScreens(@Body() request: AddTheaterScreensRequestDto) {
    return this.theaterScreenService.addScreens(request);
  }

  @Get('theater/:theaterId')
  @ApiOperation({ summary: 'List theater screens by theater id' })
  @ApiResponse({
    status: 200,
    description: 'Theater screens retrieved successfully',
    type: [TheaterScreenResponseDto],
  })
  listScreensByTheater(@Param('theaterId') theaterId: string) {
    return this.theaterScreenService.listScreensByTheater(theaterId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a theater screen by id' })
  @ApiResponse({
    status: 200,
    description: 'Theater screen retrieved successfully',
    type: TheaterScreenResponseDto,
  })
  getScreen(@Param('id') id: string) {
    return this.theaterScreenService.getScreen(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a theater screen' })
  @ApiBody({ type: UpdateTheaterScreenRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Theater screen updated successfully',
    type: TheaterScreenResponseDto,
  })
  updateScreen(
    @Param('id') id: string,
    @Body() request: UpdateTheaterScreenRequestDto,
  ) {
    return this.theaterScreenService.updateScreen(id, request);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a theater screen' })
  @ApiResponse({
    status: 200,
    description: 'Theater screen deleted successfully',
  })
  deleteScreen(@Param('id') id: string) {
    return this.theaterScreenService.deleteScreen(id);
  }
}
