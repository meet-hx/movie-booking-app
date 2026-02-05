import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../infrastructure/persistence/tokens';
import type { ShowRepository } from '../../domain/repositories/show/show.repository';

@Injectable()
export class ShowService {
  constructor(
    @Inject(REPOSITORY_TOKENS.ShowRepository)
    private readonly showRepository: ShowRepository,
  ) {}

  getPricingContext(options: { showId: string; seatIds: string[] }) {
    return this.showRepository.getPricingContext(
      options.showId,
      options.seatIds,
    );
  }

  findById(id: string) {
    return this.showRepository.findById(id);
  }
}
