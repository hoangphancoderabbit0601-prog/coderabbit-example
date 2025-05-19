import { loginSchema } from '@factory/auth';
import { Router } from 'express';

import AuthController from '../controllers/auth';
import { validationMiddleware } from '../middlewares/validation';

export default function (db: SQLize) {
  const authRouter = Router();
  const authController = new AuthController(db);

  authRouter.post(
    '/login',
    validationMiddleware(loginSchema),
    authController.login,
  );

  return authRouter;
}
