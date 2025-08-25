import {
  createCustomerSchema,
  customerIdSchema,
  Position,
  searchCustomerSchema,
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
    '/:id',
    validationMiddleware(updateCustomerSchema),
    customerController.updateCustomer,
  );

  customerRouter.delete(
    '/:id',
    authorize([Position.Administrator]),
    validationMiddleware(customerIdSchema),
    customerController.deleteCustomer,
  );

  customerRouter.get(
    '/:id',
    validationMiddleware(customerIdSchema),
    customerController.getById,
  );

  customerRouter.get(
    '/',
    validationMiddleware(searchCustomerSchema),
    customerController.getCustomer,
  );

  return customerRouter;
}
