import { NotFound } from '@factory/error';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { assign } from 'lodash';
import { AnyObjectSchema } from 'yup';

export function validationMiddleware(schema: AnyObjectSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const isMethodGet = req.method === 'GET';
    const dataToValidate = isMethodGet
      ? assign({}, req.query, req.params)
      : assign({}, req.body, req.params);

    try {
      const validatedData = await schema.validate(dataToValidate, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (isMethodGet) {
        req.query = validatedData;
      } else {
        req.body = validatedData;
      }

      return next();
    } catch (err: any) {
      if (err instanceof NotFound) {
        return res.status(StatusCodes.NOT_FOUND).json({ errors: err.message });
      }
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: err.errors });
    }
  };
}
