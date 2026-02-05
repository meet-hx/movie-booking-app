import { Module } from '@nestjs/common';
import { PersistenceModule } from 'src/infrastructure/persistence/persistence.module';
import { MovieService } from './movie.service';

@Module({
  imports: [PersistenceModule],
  providers: [MovieService],
  exports: [MovieService],
})
export class MovieModule {}
