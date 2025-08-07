import { SearchOrderType } from '@factory/order';

import { pickForSearch } from '../utils';

export class OrderMapper {
  static toOrderSearch(params: object): SearchOrderType {
    const orderSearch = pickForSearch(<SearchOrderType>params, [
      'limit',
      'offset',
    ]);
    return orderSearch;
  }
}
