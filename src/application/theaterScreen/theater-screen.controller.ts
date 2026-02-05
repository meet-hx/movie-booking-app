import { Body, Controller, Post } from '@nestjs/common';
import { TheaterScreenService } from './theater-screen.service';
import { AddTheaterScreensRequestDto } from './dto/add-theater-screens.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Theater Screens')
@Controller('theater-screens')
export class TheaterScreenController {
  constructor(private readonly theaterScreenService: TheaterScreenService) {}

  @Post()
  @ApiOperation({ summary: 'Add screens to a theater' })
  @ApiResponse({ status: 201, description: 'Screens added successfully' })
  addScreens(@Body() request: AddTheaterScreensRequestDto) {
    return this.theaterScreenService.addScreens(request);
  }
}
