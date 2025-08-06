import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import BWError from './error';

/**
 * NotFoundError
 */
export default class NotFoundError extends BWError {
  constructor(message?: string) {
    let actualMessage = message;
    if (isNil(message) || isEmpty(message)) {
      actualMessage = 'Not Found URL';
    }

    super(
      getReasonPhrase(StatusCodes.NOT_FOUND),
      actualMessage,
      StatusCodes.NOT_FOUND,
    );
  }
}
