import dayjs from 'dayjs';
import { map } from 'lodash';

import { Customer, Order } from '../model';

export class CommonRepository {
  public static findCustomerResponse = (
    customer: Customer,
    isFindAll: boolean = true,
  ) => {
    customer.dataValues.position_id =
      customer.dataValues.position_id.toString();
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
    if (isFindAll) {
      customer.dataValues.created_date = dayjs(
        customer.dataValues.created_date,
      ).format('YYYY/MM/DD');
      customer.dataValues.updated_date = dayjs(
        customer.dataValues.updated_date,
      ).format('YYYY/MM/DD');
    }
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
