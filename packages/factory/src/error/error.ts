import { StatusCodes } from 'http-status-codes';

import { messages } from '../_constant';

/**
 * Error
 */
export default class BWError extends Error {
  public readonly reason: string;
  public readonly httpStatus: StatusCodes;

  constructor(
    code: string,
    message: string = messages.systemError,
    httpStatus = StatusCodes.INTERNAL_SERVER_ERROR,
  ) {
    super(message);

    this.name = 'Error.';
    this.httpStatus = httpStatus;
    this.reason = code;
  }
}
