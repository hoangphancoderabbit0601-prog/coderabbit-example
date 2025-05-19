import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import BWError from './error';

/**
 * NotFoundError
 */
export default class NotFoundError extends BWError {
  public readonly entityName: string;

  constructor(entityName: string, message?: string) {
    let actualMessage = message;
    if (isNil(message) || isEmpty(message)) {
      actualMessage = `Not Found: ${entityName}.`;
    }

    super(
      getReasonPhrase(StatusCodes.NOT_FOUND),
      actualMessage,
      StatusCodes.NOT_FOUND,
    );

    this.entityName = entityName;
  }
}
