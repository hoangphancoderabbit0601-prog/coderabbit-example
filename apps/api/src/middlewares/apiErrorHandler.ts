import * as errors from '@factory/error';
import { NextFunction, Request, Response } from 'express';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { map } from 'lodash';
import { ValidationError } from 'sequelize';

export default (err: any, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof ValidationError) {
    res.status(StatusCodes.BAD_REQUEST).json({
      errors: map(err.errors, 'message'),
    });
  } else {
    let responseError = err;
    if (!(err instanceof errors.Error)) {
      responseError = new errors.Error(
        getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        err.message,
      );
    }

    const json: { info?: string; errors?: [string] } = {};
    if (err instanceof errors.Info) {
      json.info = responseError.message;
    } else {
      json.errors = [responseError.message];
    }

    res.status(responseError.httpStatus).json(json);
  }
};
