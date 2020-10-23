import { NestFactory } from '@nestjs/core';
import { ValidationPipe, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { createConnection } from 'typeorm';
import cookieParser from 'cookie-parser';
import glob from 'glob';

const requireDefaults = (pattern: string) => {
  return glob.sync(pattern, { cwd: __dirname, absolute: true })
    .map(require)
    .map(imported => imported.default);
}

const controllers = requireDefaults('*.module/*-controller.ts');

const middleware = requireDefaults('*.module/*-middleware.ts');

@Module({
  controllers
})
class ApplicationModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(cookieParser(), ...middleware).forRoutes('/');
  }
}

export const bootstrap = async () => {
  await createConnection();
  const app = await NestFactory.create(ApplicationModule);

  // allows for validation to be used
  app.useGlobalPipes(new ValidationPipe());

  // allows for Nest.js's auto documentation feature to be used
  const options = new DocumentBuilder().addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('/', app, document);

  await app.listen(4000);
}