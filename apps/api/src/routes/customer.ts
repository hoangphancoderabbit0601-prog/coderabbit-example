import {
  createCustomerSchema,
  Position,
  updateCustomerSchema,
} from '@factory/customer';
import { Router } from 'express';

import CustomerController from '../controllers/customer';
import { authorize } from '../middlewares/authorize';
import { validationMiddleware } from '../middlewares/validation';

export default function (db: SQLize) {
  const customerRouter = Router();
  const customerController = new CustomerController(db);

  customerRouter.post(
    '/',
    authorize([Position.Administrator]),
    validationMiddleware(createCustomerSchema),
    customerController.createCustomer,
  );

  customerRouter.put(
    '/:id([0-9]+)',
    validationMiddleware(updateCustomerSchema),
    customerController.updateCustomer,
  );

  customerRouter.delete(
    '/:id([0-9]+)',
    authorize([Position.Administrator]),
    customerController.deleteCustomer,
  );

  return customerRouter;
}
