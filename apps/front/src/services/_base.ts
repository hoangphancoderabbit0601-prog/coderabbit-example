import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';

export interface IFetchOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  params?: any;
  expectedStatusCode: StatusCodes[] | StatusCodes;
  revoke?: boolean;
  noAuth?: boolean;
  headers?: any;
  endpoint?: string;
}

/**
 * skeleton class
 */
export class Service {
  /**
   * main function to call API
   * @param {object} fetchOption custom option when run API
   */
  public async fetch<T>(
    _fetchOption: IFetchOptions,
  ): Promise<AxiosResponse<T>> {
    return {} as any;
  }
}
