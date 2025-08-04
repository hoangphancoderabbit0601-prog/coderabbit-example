import { Router } from 'express';

import apiErrorHandler from '../middlewares/apiErrorHandler';
import jwtAuthentication from '../middlewares/jwtAuthentication';
import notFoundHandler from '../middlewares/notFoundHandler';
import authRouter from './auth';

export default function (db: SQLize) {
  const router = Router();
  router.use('/', authRouter(db));

  router.use(jwtAuthentication);

  router.use(notFoundHandler);
  router.use(apiErrorHandler);

  return router;
}
