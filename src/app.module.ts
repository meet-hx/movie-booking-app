import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './application/booking/booking.module';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';
import { AuthModule } from './application/auth/auth.module';
import { UserModule } from './application/user/user.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PersistenceModule, BookingModule, AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
