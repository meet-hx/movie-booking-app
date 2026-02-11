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
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SeatCategoryService } from './seat-category.service';
import { CreateSeatCategoryRequestDto } from './dto/create-seat-category.dto';
import { DeleteSeatCategoryRequestDto } from './dto/delete-seat-category.dto';
import { SeatCategoryResponseDto } from './dto/seat-category-response.dto';
import { UpdateSeatCategoryRequestDto } from './dto/update-seat-category.dto';

@ApiTags('Seat Category')
@Controller('seat-category')
export class SeatCategoryController {
  constructor(private readonly seatCategoryService: SeatCategoryService) {}

  @Get('screen/:screenId')
  @ApiOperation({ summary: 'List seat categories by screen id' })
  @ApiResponse({
    status: 200,
    description: 'Seat categories retrieved successfully',
    type: [SeatCategoryResponseDto],
  })
  listByScreen(@Param('screenId') screenId: string) {
    return this.seatCategoryService.listByScreen(screenId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a seat category' })
  @ApiBody({ type: CreateSeatCategoryRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Seat category created successfully',
    type: SeatCategoryResponseDto,
  })
  create(@Body() request: CreateSeatCategoryRequestDto) {
    return this.seatCategoryService.create(request);
  }

  @Get()
  @ApiOperation({ summary: 'List all seat categories' })
  @ApiResponse({
    status: 200,
    description: 'Seat categories retrieved successfully',
    type: [SeatCategoryResponseDto],
  })
  listAll() {
    return this.seatCategoryService.listAll();
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a seat category' })
  @ApiBody({ type: UpdateSeatCategoryRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Seat category updated successfully',
    type: SeatCategoryResponseDto,
  })
  update(@Body() request: UpdateSeatCategoryRequestDto) {
    return this.seatCategoryService.update(request);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a seat category' })
  @ApiBody({ type: DeleteSeatCategoryRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Seat category deleted successfully',
  })
  delete(@Body() request: DeleteSeatCategoryRequestDto) {
    return this.seatCategoryService.delete(request.id);
  }
}
