import { errors } from '@factory';
import { messageApiError } from '@factory/_constant';
import { ILoginParams } from '@factory/auth';
import dayjs from 'dayjs';
import { isNil } from 'lodash';

import { comparePassword } from '../utils/bcrypt';
import { BaseRepository } from './_base';

export class AuthRepository extends BaseRepository {
  public readonly model: ACTModels['Customer'];
  constructor(db: SQLize) {
    super(db);
    this.model = this.models.Customer;
  }

  public async login(params: ILoginParams) {
    const user = await this.model.findOne({
      where: {
        email: params.email,
        deletedDate: null,
      },
    });
    if (isNil(user)) {
      throw new errors.Argument(
        'email, password',
        messageApiError.loginFailure(),
      );
    }

    const isMatchPassword = await comparePassword(
      params.password,
      user.password,
    );

    if (!isMatchPassword) {
      throw new errors.Argument(
        'email, password',
        messageApiError.loginFailure(),
      );
    }

    return {
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      started_date: dayjs(user.startedDate).format('YYYY/MM/DD'),
      position_id: user.positionId.toString(),
      created_date: dayjs(user.createdDate).format('YYYY/MM/DD'),
      updated_date: dayjs(user.updatedDate).format('YYYY/MM/DD'),
    };
  }
}
