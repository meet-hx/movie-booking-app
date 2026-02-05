import { Body, Controller, Post } from '@nestjs/common';
import { SeatService } from './seat.service';
import type { AddSeatsRequestDto } from './dto/add-seats.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Screen Seats')
@Controller('screen-seats')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Post()
  @ApiOperation({ summary: 'Add seats to a theater screen' })
  @ApiResponse({ status: 201, description: 'Seats added successfully' })
  addSeats(@Body() request: AddSeatsRequestDto) {
    return this.seatService.addSeats(request);
  }
}
