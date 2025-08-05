import { errors } from '@factory';
import { messageApiError } from '@factory/_constant';
import { createCustomerType } from '@factory/customer';

import { hashPassword } from '../utils/bcrypt';
import { BaseRepository } from './_base';

export class CustomerRepository extends BaseRepository {
  public readonly model: ACTModels['Customer'];
  constructor(db: SQLize) {
    super(db);
    this.model = this.models.Customer;
  }
  public async createCustomer(customerData: createCustomerType) {
    const foundUser = await this.model.findOne({
      where: {
        email: customerData.email,
        deletedDate: null,
      },
    });
    if (foundUser)
      throw new errors.BadRequestError(messageApiError.duplicateValueError());
    const customerModel = {
      email: customerData.email,
      name: customerData.name,
      startedDate: customerData.started_date,
      positionId: customerData.position_id,
    };
    const passwordHash = await hashPassword(customerData.password);
    const user = await this.model.create({
      ...customerModel,
      password: passwordHash,
    });
    return user;
  }
}
