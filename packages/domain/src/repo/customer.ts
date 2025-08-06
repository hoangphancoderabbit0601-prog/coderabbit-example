import { errors } from '@factory';
import { messageApiError } from '@factory/_constant';
import { createCustomerType, updateCustomerType } from '@factory/customer';
import { assign, isNil } from 'lodash';
import { Op } from 'sequelize';

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

  public async updateCustomer(
    customerData: updateCustomerType,
    customerId: bigint,
  ) {
    const foundUser = await this.model.findOne({
      where: {
        id: customerId,
        deletedDate: null,
      },
    });
    if (!foundUser) throw new errors.NotFound();
    const foundUserDuplicate = await this.model.findOne({
      where: {
        email: customerData.email,
        id: { [Op.ne]: customerId },
        deletedDate: null,
      },
    });
    if (!isNil(foundUserDuplicate))
      throw new errors.BadRequestError(messageApiError.duplicateValueError());
    let customerModel = {
      email: customerData.email,
      name: customerData.name,
      startedDate: customerData.started_date,
      positionId: customerData.position_id,
    };
    if (customerData.password) {
      const passwordHash = await hashPassword(customerData.password);
      customerModel = assign(customerModel, { password: passwordHash });
    }
    const user = await foundUser.update(customerModel);
    return user;
  }
}
