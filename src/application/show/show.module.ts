import { Module } from '@nestjs/common';
import { ShowService } from './show.service';
import { ShowController } from './show.controller';
import { PersistenceModule } from 'src/infrastructure/persistence/persistence.module';
import { TheaterModule } from '../theater/theater.module';
import { TheaterScreenModule } from '../theaterScreen/theater-screen.module';
import { MovieModule } from '../movie/movie.module';

@Module({
  imports: [PersistenceModule, MovieModule, TheaterModule, TheaterScreenModule],
  controllers: [ShowController],
  providers: [ShowService],
  exports: [ShowService],
})
export class ShowModule {}
