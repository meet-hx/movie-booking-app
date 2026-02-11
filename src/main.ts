import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { CommonExceptionFilter } from './utils/common-exception.filter';
import { CommonResponseInterceptor } from './utils/common-response.interceptor';
import { raw } from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/bookings/webhook', raw({ type: 'application/json' }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  // app.use('/bookings/webhook', raw({ type: 'application/json' }));
  app.use(cookieParser());
  app.useGlobalFilters(new CommonExceptionFilter());
  app.useGlobalInterceptors(new CommonResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Book your show')
    .setDescription('The movie booking API description')
    .setVersion('0.1')
    .addTag('movies')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('info', app, documentFactory);

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
