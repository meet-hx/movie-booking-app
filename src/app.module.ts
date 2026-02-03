import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './application/booking/booking.module';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PersistenceModule, BookingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
