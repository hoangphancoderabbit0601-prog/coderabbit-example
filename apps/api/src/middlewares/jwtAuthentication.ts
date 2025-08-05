import { errors } from '@factory';
import { IUserInfo } from '@factory/auth';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import { verifyToken } from '../utils/jwt';

export default (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = req.headers['authorization']!.split(' ')[1];
    const user = verifyToken(token) as JwtPayload;
    if (user) {
      req.user = {
        id: user.id,
        name: user.name,
        positionId: user.positionId,
      } as IUserInfo;
      next();
    } else {
      next(new errors.Unauthorized());
    }
  } catch (_error) {
    next(new errors.Unauthorized());
  }
};
