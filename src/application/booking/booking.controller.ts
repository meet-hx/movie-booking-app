import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { BookingService } from './booking.service';
import {
  CreateBookingIntentRequestDto,
  CreateBookingIntentResponseDto,
} from './dto/create-booking-intent.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreatePaymentIntentRequestDto,
  CreatePaymentIntentResponseDto,
} from './dto/create-payment-intent.dto';
import {
  GetBookingStatusParamsDto,
  GetBookingStatusResponseDto,
} from './dto/get-booking-status.dto';
import {
  StripeWebhookRequestDto,
  StripeWebhookResponseDto,
} from './dto/stripe-webhook.dto';

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

  @Post('intent/:id/payment-intent')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a Stripe payment intent for a booking' })
  @ApiBody({ type: CreatePaymentIntentRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Payment intent created successfully.',
    type: CreatePaymentIntentResponseDto,
  })
  async createPaymentIntent(
    @Param() params: GetBookingStatusParamsDto,
    @Body() request: CreatePaymentIntentRequestDto,
    @Request() req: { user: { id: string } },
  ): Promise<CreatePaymentIntentResponseDto> {
    return this.bookingService.createPaymentIntent(
      params.id,
      req.user.id,
      request,
    );
  }

  @Get(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get the status of a booking intent' })
  @ApiResponse({
    status: 200,
    description: 'Booking status retrieved successfully.',
    type: GetBookingStatusResponseDto,
  })
  async getBookingStatus(
    @Param() params: GetBookingStatusParamsDto,
    @Request() req: { user: { id: string } },
  ): Promise<GetBookingStatusResponseDto> {
    return this.bookingService.getBookingStatus(params.id, req.user.id);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Handle Stripe webhook events' })
  @ApiBody({ type: StripeWebhookRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Webhook event processed.',
    type: StripeWebhookResponseDto,
  })
  async handleWebhook(
    @Req() req: ExpressRequest,
    @Headers('stripe-signature') signature: string | undefined,
  ): Promise<StripeWebhookResponseDto> {
    return this.bookingService.handleStripeWebhook(req.body, signature);
  }
}
