import { ILoginParams } from '@factory/auth';

import { pick } from '../utils';

export class AuthMapper {
  static toLogin(params: object): ILoginParams {
    const userData = pick(<ILoginParams>params, ['email', 'password']);
    return userData;
  }
}
