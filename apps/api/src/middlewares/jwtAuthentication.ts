import { errors } from '@factory';
import { NextFunction, Request, Response } from 'express';

import { JwtPayload, verifyToken } from '../utils/jwt';

export default (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = req.headers['authorization']!.split(' ')[1];
    const user = verifyToken(token) as JwtPayload;
    if (user) {
      req.user = {
        id: user.id,
        name: user.name,
        positionId: user.position_id,
        email: user.email,
        startedDate: user.started_date,
      };
      next();
    } else {
      next(new errors.Unauthorized());
    }
  } catch (_error) {
    next(new errors.Unauthorized());
  }
};
