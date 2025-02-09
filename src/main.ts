import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { envs } from './config/env';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Payments-ms');
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.NATS,
      options: {
        servers: envs.NATS_SERVERS,
      },
    },
    { inheritAppConfig: true },
  );
  await app.startAllMicroservices();
  app.setGlobalPrefix('api', {
    exclude: [
      {
        path: '',
        method: RequestMethod.GET,
      },
    ],
  });
  await app.listen(envs.PORT);
  logger.debug(`Payments-ms is running on http://localhost:${envs.PORT}`);
}
bootstrap();
