import { Body, Controller, Post } from '@nestjs/common';
import { SeatService } from './seat.service';
import type { AddSeatsRequestDto } from './dto/add-seats.dto';

@Controller('screen-seats')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Post()
  addSeats(@Body() request: AddSeatsRequestDto) {
    return this.seatService.addSeats(request);
  }
}
