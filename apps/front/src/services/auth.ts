import { ILoginParams, ILoginResponse } from '@factory/auth';
import { StatusCodes } from 'http-status-codes';

import { Service } from './_base';

export class AuthService extends Service {
  public async login(params: ILoginParams) {
    return this.fetch<ILoginResponse>({
      url: '/v1/login',
      method: 'POST',
      data: params,
      expectedStatusCode: StatusCodes.OK,
      noAuth: true,
    });
  }
}
