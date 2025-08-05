import { errors } from '@factory';
import { NextFunction, Request, Response } from 'express';
import { includes } from 'lodash';

export const authorize = (allowedPermission: number[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const userPosition = req.user?.positionId;

    if (includes(allowedPermission, userPosition)) {
      return next();
    }

    return next(new errors.Forbidden());
  };
};
