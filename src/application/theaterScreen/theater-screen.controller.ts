import { Body, Controller, Post } from '@nestjs/common';
import { TheaterScreenService } from './theater-screen.service';
import type { AddTheaterScreensRequestDto } from './dto/add-theater-screens.dto';

@Controller('theater-screens')
export class TheaterScreenController {
  constructor(private readonly theaterScreenService: TheaterScreenService) {}

  @Post()
  addScreens(@Body() request: AddTheaterScreensRequestDto) {
    return this.theaterScreenService.addScreens(request);
  }
}
