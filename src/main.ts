import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createWriteStream } from 'fs';
import { get } from 'http';
import { HttpExceptionFilter } from './exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import { settings } from './settings';

const port = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const errorsForResponse = [];
        errors.forEach((e) => {
          const constraintsKeys = Object.keys(e.constraints);
          constraintsKeys.forEach((c) => {
            errorsForResponse.push({
              message: e.constraints[c],
              field: e.property,
            });
          });
        });
        throw new BadRequestException(errorsForResponse);
      },
    }),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Instagram')
    .setDescription('The Instagram API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(port, () => {
    console.log(`App started at ${port} port`);
  });

  // get the swagger json file (if app is running in development mode)
  if (process.env.NODE_ENV === 'development') {
    // write swagger ui files
    get(
      `${settings.CURRENT_APP_BASE_URL}/swagger/swagger-ui-bundle.js`,
      function (response) {
        response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js'));
        console.log(
          `Swagger UI bundle file written to: '/swagger-static/swagger-ui-bundle.js'`,
        );
      },
    );

    get(
      `${settings.CURRENT_APP_BASE_URL}/swagger/swagger-ui-init.js`,
      function (response) {
        response.pipe(createWriteStream('swagger-static/swagger-ui-init.js'));
        console.log(
          `Swagger UI init file written to: '/swagger-static/swagger-ui-init.js'`,
        );
      },
    );

    get(
      `${settings.CURRENT_APP_BASE_URL}/swagger/swagger-ui-standalone-preset.js`,
      function (response) {
        response.pipe(
          createWriteStream('swagger-static/swagger-ui-standalone-preset.js'),
        );
        console.log(
          `Swagger UI standalone preset file written to: '/swagger-static/swagger-ui-standalone-preset.js'`,
        );
      },
    );

    get(
      `${settings.CURRENT_APP_BASE_URL}/swagger/swagger-ui.css`,
      function (response) {
        response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
        console.log(
          `Swagger UI css file written to: '/swagger-static/swagger-ui.css'`,
        );
      },
    );
  }
}
bootstrap();
