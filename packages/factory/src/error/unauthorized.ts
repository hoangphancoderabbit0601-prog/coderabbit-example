import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import BWError from './error';

/**
 * UnauthorizedError
 */
export default class UnauthorizedError extends BWError {
  constructor(message?: string) {
    let actualMessage = message;
    if (isNil(message) || isEmpty(message)) {
      actualMessage = 'Unauthorized.';
    }

    super(
      getReasonPhrase(StatusCodes.UNAUTHORIZED),
      actualMessage,
      StatusCodes.UNAUTHORIZED,
    );
  }
}
