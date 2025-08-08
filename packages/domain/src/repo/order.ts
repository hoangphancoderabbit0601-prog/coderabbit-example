import { SearchOrderType } from '@factory/order';

import { BaseRepository } from './_base';
import { CommonRepository } from './common';

export class OrderRepository extends BaseRepository {
  public readonly model: ACTModels['Order'];
  constructor(db: SQLize) {
    super(db);
    this.model = this.models.Order;
  }
  public async getOrders(dto: SearchOrderType) {
    const { limit, offset } = dto;
    const { rows, count } = await this.model.findAndCountAll({
      include: [
        {
          model: this.models.Customer,
          as: 'customer',
          required: false,
          attributes: ['id', 'name'],
        },
      ],
      limit: limit ? Number(limit) : undefined,
      attributes: [
        ['order_id', 'id'],
        'item_name',
        'item_code',
        'item_quantity',
        'created_date',
        'updated_date',
        'deleted_date',
      ],
      offset: limit && offset ? (offset - 1) * limit : undefined,
      paranoid: false,
    });
    return {
      rows: CommonRepository.findListOrderResponse(rows),
      count,
    };
  }
}
