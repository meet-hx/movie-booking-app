import { Module } from '@nestjs/common';
import { ShowService } from './show.service';
import { PersistenceModule } from 'src/infrastructure/persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  providers: [ShowService],
  exports: [ShowService],
})
export class ShowModule {}
