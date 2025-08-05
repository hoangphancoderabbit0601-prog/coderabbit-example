import { CustomerRepository } from '@domain/repo';
import { NextFunction, Request, Response } from 'express';

import BaseController from './_base';

class CustomerController extends BaseController {
  private readonly customerRepository: CustomerRepository;

  constructor(db: SQLize) {
    super(db);
    this.customerRepository = new CustomerRepository(this.db);

    this.createCustomer = this.nextWrapper(this.createCustomer);
  }

  public createCustomer = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    const result = await this.customerRepository.createCustomer(req.body);
    this.created(res, {
      id: result.id.toString(),
    });
  };
}

export default CustomerController;
