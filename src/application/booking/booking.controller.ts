import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import {
  CreateBookingIntentRequestDto,
  CreateBookingIntentResponseDto,
} from './dto/create-booking-intent.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('intent')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a booking intent for selected seats' })
  @ApiBody({ type: CreateBookingIntentRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Booking intent created successfully.',
    type: CreateBookingIntentResponseDto,
  })
  async createBookingIntent(
    @Body() request: CreateBookingIntentRequestDto,
    @Request() req: { user: { id: string } },
  ): Promise<CreateBookingIntentResponseDto> {
    return this.bookingService.createBookingIntent(request, req.user.id);
  }
}
