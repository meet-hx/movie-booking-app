import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './application/booking/booking.module';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';
import { AuthModule } from './application/auth/auth.module';
import { UserModule } from './application/user/user.module';
import { TheaterModule } from './application/theater/theater.module';
import { TheaterScreenModule } from './application/theaterScreen/theater-screen.module';
import { SeatModule } from './application/seat/seat.module';
import { MovieModule } from './application/movie/movie.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PersistenceModule,
    BookingModule,
    AuthModule,
    UserModule,
    TheaterModule,
    TheaterScreenModule,
    SeatModule,
    MovieModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
