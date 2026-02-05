import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SeatService } from './seat.service';
import { AddSeatsRequestDto } from './dto/add-seats.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ScreenSeatResponseDto } from './dto/screen-seat-response.dto';
import { UpdateScreenSeatRequestDto } from './dto/update-screen-seat.dto';

@ApiTags('Screen Seats')
@Controller('screen-seats')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Post()
  @ApiOperation({ summary: 'Add seats to a theater screen' })
  @ApiBody({ type: AddSeatsRequestDto })
  @ApiResponse({ status: 201, description: 'Seats added successfully' })
  addSeats(@Body() request: AddSeatsRequestDto) {
    return this.seatService.addSeats(request);
  }

  @Get('screen/:theaterScreenId')
  @ApiOperation({ summary: 'List screen seats by theater screen id' })
  @ApiResponse({
    status: 200,
    description: 'Screen seats retrieved successfully',
    type: [ScreenSeatResponseDto],
  })
  listSeatsByScreen(@Param('theaterScreenId') theaterScreenId: string) {
    return this.seatService.listSeatsByScreen(theaterScreenId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a screen seat by id' })
  @ApiResponse({
    status: 200,
    description: 'Screen seat retrieved successfully',
    type: ScreenSeatResponseDto,
  })
  getSeat(@Param('id') id: string) {
    return this.seatService.getSeat(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a screen seat' })
  @ApiBody({ type: UpdateScreenSeatRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Screen seat updated successfully',
    type: ScreenSeatResponseDto,
  })
  updateSeat(
    @Param('id') id: string,
    @Body() request: UpdateScreenSeatRequestDto,
  ) {
    return this.seatService.updateSeat(id, request);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a screen seat' })
  @ApiResponse({ status: 200, description: 'Screen seat deleted successfully' })
  deleteSeat(@Param('id') id: string) {
    return this.seatService.deleteSeat(id);
  }
}
