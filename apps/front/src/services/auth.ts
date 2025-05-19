import { ILoginParams, IUserInfo } from '@factory/auth';
import { StatusCodes } from 'http-status-codes';

import { Service } from './_base';

export class AuthService extends Service {
  public async login(params: ILoginParams) {
    return this.fetch<IUserInfo & { token: string }>({
      url: '/auth/login',
      method: 'POST',
      data: params,
      expectedStatusCode: StatusCodes.OK,
      noAuth: true,
    });
  }
}
