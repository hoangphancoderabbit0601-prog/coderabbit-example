import { SearchOrderResponseFormatType, SearchOrderType } from '@factory/order';
import { StatusCodes } from 'http-status-codes';

import { Service } from './_base';

export class OrderService extends Service {
  public async searchOrder(params: SearchOrderType) {
    return this.fetch<SearchOrderResponseFormatType>({
      url: '/v1/order',
      method: 'GET',
      params: params,
      expectedStatusCode: StatusCodes.OK,
      noAuth: false,
    });
  }

  public async importOrders(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.fetch<{ data: { success: boolean; message: string } }>({
      url: '/v1/order/import',
      method: 'POST',
      data: formData,
      expectedStatusCode: StatusCodes.OK,
      noAuth: false,
    });
  }
}
