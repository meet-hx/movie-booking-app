import { Module } from '@nestjs/common';
import { ShowService } from './show.service';
import { REPOSITORY_TOKENS } from '../../infrastructure/persistence/tokens';
import { PrismaShowRepository } from 'src/infrastructure/prisma/repositories/prisma-show.repository';

@Module({
  imports: [],
  providers: [
    ShowService,
    {
      provide: REPOSITORY_TOKENS.ShowRepository,
      useClass: PrismaShowRepository,
    },
  ],
  exports: [ShowService],
})
export class ShowModule {}
