import {
  CreateCustomerType,
  SearchCustomerResponseFormatType,
  SearchCustomerResponseType,
  SearchCustomerType,
  UpdateCustomerType,
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

  public async getCustomerById(id: string) {
    return this.fetch<{ customer: SearchCustomerResponseType }>({
      url: `/v1/customer/${id}`,
      method: 'GET',
      expectedStatusCode: StatusCodes.OK,
      noAuth: false,
    });
  }

  public async createCustomer(data: CreateCustomerType) {
    return this.fetch<{ id: string }>({
      url: '/v1/customer',
      method: 'POST',
      data: data,
      expectedStatusCode: StatusCodes.CREATED,
      noAuth: false,
    });
  }

  public async updateCustomer(id: string, data: UpdateCustomerType) {
    return this.fetch<{ id: string }>({
      url: `/v1/customer/${id}`,
      method: 'PUT',
      data: data,
      expectedStatusCode: StatusCodes.OK,
      noAuth: false,
    });
  }

  public async deleteCustomer(id: string) {
    return this.fetch<void>({
      url: `/v1/customer/${id}`,
      method: 'DELETE',
      expectedStatusCode: StatusCodes.NO_CONTENT,
      noAuth: false,
    });
  }
}
