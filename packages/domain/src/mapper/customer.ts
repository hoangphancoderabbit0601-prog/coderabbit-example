import { CreateCustomerType, SearchCustomerType } from '@factory/customer';

import { pick, pickForSearch } from '../utils';

export class CustomerMapper {
  static toUserUpsert(params: object): CreateCustomerType {
    const userData = pick(<CreateCustomerType>params, [
      'email',
      'name',
      'password',
      'position_id',
      'started_date',
    ]);
    return userData;
  }

  static toCustomerSearch(params: object): SearchCustomerType {
    const productSearch = pickForSearch(<SearchCustomerType>params, [
      'name',
      'position_id',
      'started_date_from',
      'started_date_to',
      'limit',
      'offset',
    ]);
    return productSearch;
  }
}
