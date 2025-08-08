import { OrderMapper } from '@domain/mapper';
import { OrderRepository } from '@domain/repo';
import { NextFunction, Request, Response } from 'express';

import BaseController from './_base';

export class OrderController extends BaseController {
  private readonly orderRepository: OrderRepository;

  constructor(db: SQLize) {
    super(db);
    this.orderRepository = new OrderRepository(this.db);

    this.getOrders = this.nextWrapper(this.getOrders);
  }

  public getOrders = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    const dataSearch = OrderMapper.toOrderSearch(req.query);
    const result = await this.orderRepository.getOrders(dataSearch);
    res.json({ total_count: result.count, order: result.rows });
  };
}
