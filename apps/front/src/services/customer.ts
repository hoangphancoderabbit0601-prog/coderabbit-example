import {
  SearchCustomerResponseFormatType,
  SearchCustomerType,
} from '@factory/customer';
import { StatusCodes } from 'http-status-codes';

import { Service } from './_base';

export class CustomerService extends Service {
  public async searchCustomer(params: SearchCustomerType) {
    return this.fetch<SearchCustomerResponseFormatType>({
      url: '/v1/customer',
      method: 'GET',
      params: params,
      expectedStatusCode: StatusCodes.OK,
      noAuth: false,
    });
  }
}
