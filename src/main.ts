import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as expressHbs from 'express-handlebars';
import * as hbs from 'hbs';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

const staticAssets = join(__dirname, '../../public');
const baseViewsDir = join(__dirname, '../../views');
const layoutsDir = join(__dirname, '../../views/layouts');
const partials = join(__dirname, '../../views/partials');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.useStaticAssets(staticAssets);

  app.setBaseViewsDir(baseViewsDir);
  app.engine(
    'hbs',
    expressHbs.engine({
      layoutsDir: layoutsDir,
      defaultLayout: 'layout',
      extname: 'hbs',
    }),
  );
  hbs.registerPartials(partials);
  app.setViewEngine('hbs');

  await app.listen(3000);
}
bootstrap();
