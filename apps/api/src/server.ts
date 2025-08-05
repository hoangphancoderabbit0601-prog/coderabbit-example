import 'module-alias/register';

import cors from 'cors';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import qs from 'qs';

import { PORT } from './LoadEnv';
import router from './routes';
import createClient from './sequelize';

async function main() {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.tz.setDefault('Asia/Ho_Chi_Minh');

  const app = express();
  const sequelize = await createClient();

  const options: cors.CorsOptions = {
    origin: '*',
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'X-Access-Token',
      'Authorization',
    ],
    credentials: true,
    methods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'PATCH', 'POST', 'DELETE'],
    preflightContinue: false,
    optionsSuccessStatus: StatusCodes.NO_CONTENT,
    exposedHeaders: ['X-Total-Count'],
  };
  app.use(cors(options));

  app.set('query parser', (str: any) =>
    qs.parse(str, {
      arrayLimit: 1000,
      parseArrays: true,
      allowDots: false,
      allowPrototypes: true,
    }),
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ limit: '1mb', extended: true }));

  app.use('/api/v1', router(sequelize));

  app.listen(PORT, () => console.log(`Run on http://localhost:${PORT}`));
}

main();
