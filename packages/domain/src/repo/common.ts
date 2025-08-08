import { Position } from '@factory/customer';
import dayjs from 'dayjs';
import { map } from 'lodash';

import { Customer, Order } from '../model';

export class CommonRepository {
  public static findCustomerResponse = (customer: Customer) => {
    let positionLabel = 'Unknow label';
    switch (customer.dataValues.position_id) {
      case Position.Administrator:
        positionLabel = '管理者';
        break;
      case Position.Group:
        positionLabel = 'グループ管理者';
        break;
      case Position.User:
        positionLabel = '一般ユーザ';
        break;
    }
    customer.dataValues.position_id = positionLabel;
    customer?.dataValues?.orders
      ? map(customer.dataValues.orders, (order) => {
          order.dataValues.id = order.dataValues.id.toString();
          order.dataValues.created_date = dayjs(
            order.dataValues.created_date,
          ).format('YYYY/MM/DD');
        })
      : '';
    customer.dataValues.id = customer.dataValues.id.toString();
    customer.dataValues.started_date = dayjs(
      customer.dataValues.started_date,
    ).format('YYYY/MM/DD');
    return customer;
  };

  public static findListCustomerResponse = (customers: Customer[]) => {
    map(customers, (customer) => {
      this.findCustomerResponse(customer);
    });
    return customers;
  };

  public static findListOrderResponse = (orders: Order[]) => {
    map(orders, (order) => {
      order.dataValues.id = order.dataValues.id.toString();
      order.dataValues.created_date = dayjs(
        order.dataValues.created_date,
      ).format('YYYY/MM/DD');
      order.dataValues.updated_date = dayjs(
        order.dataValues.updated_date,
      ).format('YYYY/MM/DD');
      order.dataValues.deleted_date = order.dataValues.deleted_date
        ? dayjs(order.dataValues.deleted_date).format('YYYY/MM/DD')
        : '';
      order.dataValues.customer.dataValues.id =
        order.dataValues.customer.dataValues.id.toString();
      order.dataValues.item_quantity =
        order.dataValues.item_quantity.toString();
    });
    return orders;
  };
}
