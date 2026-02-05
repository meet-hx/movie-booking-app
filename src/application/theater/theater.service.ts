import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../infrastructure/persistence/tokens';
import type { TheaterRepository } from '../../domain/repositories/theater/theater.repository';
import {
  CreateTheaterRequestDto,
  UpdateTheaterRequestDto,
} from './dto/create-theater.dto';
import { TheaterScreenService } from '../theaterScreen/theater-screen.service';

@Injectable()
export class TheaterService {
  constructor(
    @Inject(REPOSITORY_TOKENS.TheaterRepository)
    private readonly theaterRepository: TheaterRepository,
    private readonly theaterScreenService: TheaterScreenService,
  ) {}

  async createTheater(request: CreateTheaterRequestDto) {
    const theater = await this.theaterRepository.create({
      name: request.name,
      address: request.address,
      city: request.city,
      state: request.state,
      zipCode: request.zipCode,
      country: request.country,
      phone: request.phone,
      email: request.email,
      website: request.website,
    });

    if (request.screens?.length) {
      await this.theaterScreenService.addScreens({
        theaterId: theater.id,
        screens: request.screens,
      });
    }

    return theater;
  }

  async updateTheater(id: string, request: UpdateTheaterRequestDto) {
    const exists = await this.theaterRepository.exists(id);
    if (!exists) {
      throw new NotFoundException('Theater not found.');
    }

    return this.theaterRepository.update(id, request);
  }

  async deleteTheater(id: string) {
    const exists = await this.theaterRepository.exists(id);
    if (!exists) {
      throw new NotFoundException('Theater not found.');
    }

    await this.theaterRepository.delete(id);
    return { deleted: true };
  }

  async getTheater(id: string) {
    const theater = await this.theaterRepository.findById(id);
    if (!theater) {
      throw new NotFoundException('Theater not found.');
    }
    return theater;
  }

  listTheaters() {
    return this.theaterRepository.findAll();
  }

  async ensureExists(id: string) {
    const exists = await this.theaterRepository.exists(id);
    if (!exists) {
      throw new NotFoundException('Theater not found.');
    }
  }
}
