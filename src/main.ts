import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

let cloudRun = false;

const TIMER_LABEL = 'startup';

if (process.env.K_SERVICE) {
  console.log('Detected running in Cloud Run');
  cloudRun = true;
}

async function bootstrap() {
  console.time(TIMER_LABEL);
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const PORT_ENV = configService.get<number>('PORT', 3000);

  const GRPC_PORT_VARIABLE = configService.get<number>('GRPC_PORT', 5000);
  const SECONDARY_HTTP_PORT = configService.get<number>('HTTP_PORT', 8081);

  const HTTP_PORT = cloudRun ? SECONDARY_HTTP_PORT : PORT_ENV;
  const GRPC_PORT = cloudRun ? PORT_ENV : GRPC_PORT_VARIABLE;

  const protoDir = join(__dirname, '..', 'protos');

  const serviceList = [
    //    'protos/my/service.proto',
    'protos/health.proto',
  ];

  const protoPathList = serviceList.map((value) => {
    return join(__dirname, value);
  });

  const options: GrpcOptions = {
    transport: Transport.GRPC,
    options: {
      url: `0.0.0.0:${GRPC_PORT}`,
      package: ['grpc.health.v1'],
      protoPath: protoPathList,
      loader: {
        keepCase: true,
        longs: Number,
        defaults: false,
        arrays: true,
        objects: true,
        includeDirs: [protoDir],
      },
    },
  };

  app.connectMicroservice(options);

  //Support setting a Global Prefix via environment variables
  const GLOBAL_PREFIX = configService.get('GLOBAL_PREFIX');
  if (GLOBAL_PREFIX) {
    app.setGlobalPrefix(GLOBAL_PREFIX);
  }

  await app.startAllMicroservices();

  await app.listen(HTTP_PORT);
  console.timeEnd(TIMER_LABEL);
  console.info(
    `Application listening on HTTP Port ${HTTP_PORT} and GRPC port ${GRPC_PORT}.`,
  );
}
bootstrap();
