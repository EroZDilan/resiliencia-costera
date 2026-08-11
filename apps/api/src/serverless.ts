import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import express = require('express');
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AppModule } from './app.module';
import { configureApp } from './app-setup';
// TypeORM resolves DB drivers via a dynamic require(driverName), which static
// bundlers (Vercel's file tracing included) can't follow. This import forces
// mysql2 into the serverless bundle so it's present at runtime.
import 'mysql2';

// Express apps are already valid (req, res) request listeners, which is
// exactly the handler shape Vercel's Node.js runtime expects — no adapter
// needed. Cached across warm invocations so Nest only bootstraps once.
let cachedApp: express.Express | undefined;

async function buildApp(): Promise<express.Express> {
  const expressApp = express();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(expressApp));
  configureApp(app);
  await app.init();
  return expressApp;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!cachedApp) {
    cachedApp = await buildApp();
  }
  cachedApp(req as unknown as express.Request, res as unknown as express.Response);
}
