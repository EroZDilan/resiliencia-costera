import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

export function configureApp(app: NestExpressApplication): void {
  const config = app.get(ConfigService);

  app.enableCors({ origin: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // Falls back to /tmp on serverless runtimes where the repo path isn't writable/present.
  app.useStaticAssets(config.get<string>('UPLOADS_DIR') ?? '/tmp/uploads', { prefix: '/uploads' });
}
