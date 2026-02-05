import { Module } from '@nestjs/common';
import { PersistenceModule } from 'src/infrastructure/persistence/persistence.module';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';

@Module({
  imports: [PersistenceModule],
  providers: [MovieService],
  controllers: [MovieController],
  exports: [MovieService],
})
export class MovieModule {}
