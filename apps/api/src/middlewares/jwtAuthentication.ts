import { errors } from '@factory';
import { NextFunction, Request, Response } from 'express';

import { verifyToken } from '../utils/jwt';

export default (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = req.headers['authorization']!.split(' ')[1];

    if (verifyToken(token)) {
      next();
    } else {
      next(new errors.Unauthorized());
    }
  } catch (_error) {
    next(new errors.Unauthorized());
  }
};
