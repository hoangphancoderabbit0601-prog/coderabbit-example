import { errors } from '@factory';
import { messageApiError } from '@factory/_constant';
import {
  CreateCustomerType,
  SearchCustomerType,
  UpdateCustomerType,
} from '@factory/customer';
import { assign, isNil } from 'lodash';
import { Op, WhereOptions } from 'sequelize';

import { hashPassword } from '../utils/bcrypt';
import { makeAmbiguousWhere, searchDateFromTo } from '../utils/query';
import { BaseRepository } from './_base';
import { CommonRepository } from './common';

export class CustomerRepository extends BaseRepository {
  public readonly model: ACTModels['Customer'];
  constructor(db: SQLize) {
    super(db);
    this.model = this.models.Customer;
  }
  public async createCustomer(customerData: CreateCustomerType) {
    const foundUser = await this.model.findOne({
      where: {
        email: customerData.email,
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
    customerData: UpdateCustomerType,
    customerId: bigint,
  ) {
    const foundUser = await this.model.findOne({
      where: {
        id: customerId,
      },
    });
    if (!foundUser) throw new errors.NotFound();
    const foundUserDuplicate = await this.model.findOne({
      where: {
        email: customerData.email,
        id: { [Op.ne]: customerId },
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

  public async deleteCustomer(id: string) {
    const foundUser = await this.model.findByPk(id);
    if (!foundUser) throw new errors.NotFound();
    await foundUser.destroy();
  }

  public async getCustomer(dto: SearchCustomerType) {
    const {
      name,
      position_id,
      started_date_from,
      started_date_to,
      offset,
      limit,
    } = dto;
    const query: WhereOptions = {};
    const startDateQuery = searchDateFromTo({
      from: started_date_from,
      to: started_date_to,
    });
    if (
      Object.keys(startDateQuery).length > 0 ||
      Object.getOwnPropertySymbols(startDateQuery).length > 0
    ) {
      query.startedDate = startDateQuery;
    }
    Object.assign(
      query,
      isNil(name) ? {} : makeAmbiguousWhere(dto, 'name', 'name'),
    );
    position_id && position_id?.length > 0
      ? (query.positionId = { [Op.in]: position_id })
      : '';

    const { rows, count } = await this.model.findAndCountAll({
      where: query,
      include: [
        {
          model: this.models.Order,
          as: 'orders',
          required: false,
          attributes: [['order_id', 'id'], 'item_name', 'created_date'],
        },
      ],
      order: [
        ['name', 'ASC'],
        ['startedDate', 'ASC'],
        ['id', 'ASC'],
      ],
      attributes: ['id', 'email', 'name', 'started_date', 'position_id'],
      limit: limit ? Number(limit) : undefined,
      offset: limit && offset ? (offset - 1) * limit : undefined,
    });

    return { rows: CommonRepository.findListCustomerResponse(rows), count };
  }

  public async getCustomerById(id: bigint) {
    const foundCustomer = await this.model.findByPk(id, {
      attributes: ['id', 'email', 'name', 'started_date', 'position_id'],
    });
    if (!foundCustomer) throw new errors.NotFound();
    return CommonRepository.findCustomerResponse(foundCustomer);
  }
}
