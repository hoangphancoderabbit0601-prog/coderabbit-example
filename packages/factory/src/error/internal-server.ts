import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { isEmpty, isNil } from 'lodash';

import BWError from './error';

export default class InternalServerError extends BWError {
  constructor(message?: string) {
    let actualMessage = message;
    if (isNil(message) || isEmpty(message)) {
      actualMessage = 'ERROR'; // Default message
    }

    super(
      getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
      actualMessage,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
