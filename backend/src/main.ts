import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { SwaggerRegistrar } from './Configurations/Registrar/SwaggerRegistrar';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response } from 'express';
import { Logger, type INestApplication } from '@nestjs/common';
import basicAuth from 'express-basic-auth';
import { DataSource } from 'typeorm';

import { renderLandingPage } from './pages/landing.page';
import { renderHealthPage } from './pages/health.page';

let appInstance: INestApplication | null = null;
const server = express();
const logger = new Logger('Bootstrap');
server.disable('x-powered-by');

const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

const ENV_PREFIX = isProduction ? 'PROD_' : 'DEV_';

const env = (key: string, fallback = ''): string =>
  process.env[`${ENV_PREFIX}${key}`] ?? fallback;

const envBool = (key: string, fallback = false) =>
  env(key, fallback ? 'true' : 'false') === 'true';

const envNum = (key: string, fallback = 0) =>
  Number(env(key, String(fallback)));

const appName = env('APP_NAME', 'Enterprise POS API');
const enableSwagger = envBool('ENABLE_SWAGGER', true);
const swaggerPath = env('SWAGGER_PATH', 'swagger');

const port = envNum('PORT', 3000);

async function bootstrap(): Promise<INestApplication> {
  if (appInstance) return appInstance;

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  server.get('/', (_req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(
      renderLandingPage({
        appName,
        envName: NODE_ENV,
        swaggerEnabled: enableSwagger,
        swaggerPath,
        envPrefixLabel: ENV_PREFIX,
      }),
    );
  });

  server.get('/health', async (req, res) => {
    const dataSource = app.get(DataSource);
    let databaseStatus: 'up' | 'down' = 'down';

    if (dataSource.isInitialized) {
      try {
        await dataSource.query('SELECT 1');
        databaseStatus = 'up';
      } catch (error) {
        logger.error('Database readiness check failed.', error);
      }
    }

    const status: 'ok' | 'degraded' =
      databaseStatus === 'up' ? 'ok' : 'degraded';
    const payload = {
      status,
      app: appName,
      env: NODE_ENV,
      database: databaseStatus,
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    };

    const wantsJson =
      req.query.format === 'json' ||
      (req.headers.accept?.includes('application/json') &&
        !req.headers.accept?.includes('text/html'));

    if (wantsJson) {
      return res.status(status === 'ok' ? 200 : 503).json(payload);
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(status === 'ok' ? 200 : 503).send(
      renderHealthPage({
        appName,
        envName: NODE_ENV,
        status: payload.status,
        databaseStatus: payload.database,
        uptimeSeconds: payload.uptimeSeconds,
        timestampISO: payload.timestamp,
        swaggerEnabled: enableSwagger,
        swaggerPath,
      }),
    );
  });

  if (enableSwagger) {
    const swaggerUser = env('SWAGGER_USER');
    const swaggerPass = env('SWAGGER_PASS');

    if (swaggerUser && swaggerPass) {
      // Protect EVERYTHING under /swagger and also /swagger-json
      server.use(
        `/${swaggerPath}`,
        basicAuth({
          challenge: true,
          users: { [swaggerUser]: swaggerPass },
        }),
      );

      server.use(
        `/${swaggerPath}-json`,
        basicAuth({
          challenge: true,
          users: { [swaggerUser]: swaggerPass },
        }),
      );
    }

    const document = SwaggerModule.createDocument(app, SwaggerRegistrar());

    SwaggerModule.setup(swaggerPath, app, document, {
      customSiteTitle: appName,
      customCssUrl: 'https://unpkg.com/swagger-ui-dist/swagger-ui.css',
      customJs: [
        'https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js',
        'https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js',
      ],
    });

    server.get(`/${swaggerPath}-json`, (_req, res) => res.json(document));
  }

  logger.log(
    `Starting ${appName} in ${NODE_ENV} mode with env prefix ${ENV_PREFIX}`,
  );

  await app.init();
  appInstance = app;
  return app;
}

async function startLocalServer() {
  const app = await bootstrap();
  await app.listen(port);
}

if (!isProduction) {
  void startLocalServer().catch((error: unknown) => {
    logger.error('Failed to start local server.', error);
    process.exitCode = 1;
  });
}

export default async function handler(req: Request, res: Response) {
  if (!appInstance) {
    await bootstrap();
  }
  server(req, res);
}
