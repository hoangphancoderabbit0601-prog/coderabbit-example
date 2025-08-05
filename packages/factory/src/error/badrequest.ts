import { getReasonPhrase, StatusCodes } from 'http-status-codes';

import BWError from './error';

export default class BadRequestError extends BWError {
  constructor(message: string) {
    super(
      getReasonPhrase(StatusCodes.BAD_REQUEST),
      message,
      StatusCodes.BAD_REQUEST,
    );
  }
}
