import { Position } from '@factory/customer';
import { searchOrderSchema } from '@factory/order';
import { Router } from 'express';

import { OrderController } from '../controllers/order';
import { authorize } from '../middlewares/authorize';
import { validationMiddleware } from '../middlewares/validation';

export default function (db: SQLize) {
  const orderRouter = Router();
  const orderController = new OrderController(db);

  orderRouter.get(
    '/',
    authorize([Position.Administrator]),
    validationMiddleware(searchOrderSchema),
    orderController.getOrders,
  );

  return orderRouter;
}
