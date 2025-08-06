import { createCustomerType } from '@factory/customer';

import { pick } from '../utils';

export class CustomerMapper {
  static toUserUpsert(params: object): createCustomerType {
    const userData = pick(<createCustomerType>params, [
      'email',
      'name',
      'password',
      'position_id',
      'started_date',
    ]);
    return userData;
  }
}
