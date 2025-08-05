import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AnyObjectSchema } from 'yup';

export function validationMiddleware(schema: AnyObjectSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const isMethodGet = req.method === 'GET';
    const dataToValidate = isMethodGet ? req.query : req.body;

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
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: err.errors });
    }
  };
}
