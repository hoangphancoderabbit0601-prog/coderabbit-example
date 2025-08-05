import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import BWError from './error';

/**
 * ForbiddenError
 */
export default class ForbiddenError extends BWError {
  constructor(message?: string) {
    let actualMessage = message;
    if (isNil(message) || isEmpty(message)) {
      actualMessage = '権限がないURLです';
    }

    super(
      getReasonPhrase(StatusCodes.FORBIDDEN),
      actualMessage,
      StatusCodes.FORBIDDEN,
    );
  }
}
