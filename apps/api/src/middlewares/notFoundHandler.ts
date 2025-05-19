import { NotFound } from '@factory/error';
import { NextFunction, Request, Response } from 'express';

export default (req: Request, _res: Response, next: NextFunction) => {
  next(new NotFound(`router for [${req.originalUrl}]`));
};
