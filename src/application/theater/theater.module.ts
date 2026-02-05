import { Module, forwardRef } from '@nestjs/common';
import { PersistenceModule } from '../../infrastructure/persistence/persistence.module';
import { TheaterController } from './theater.controller';
import { TheaterScreenModule } from '../theaterScreen/theater-screen.module';
import { TheaterService } from './theater.service';

@Module({
  imports: [PersistenceModule, forwardRef(() => TheaterScreenModule)],
  providers: [TheaterService],
  controllers: [TheaterController],
  exports: [TheaterService],
})
export class TheaterModule {}
