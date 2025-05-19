import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import BWError from './error';

/**
 * ArgumentError
 */
export default class ArgumentError extends BWError {
  public readonly argumentName: string;

  constructor(argumentName: string, message?: string) {
    let actualMessage = message;
    if (isNil(message) || isEmpty(message)) {
      actualMessage = `Invalid or missing argument supplied: ${argumentName}.`;
    }

    super(
      getReasonPhrase(StatusCodes.BAD_REQUEST),
      actualMessage,
      StatusCodes.BAD_REQUEST,
    );

    this.argumentName = argumentName;
  }
}
