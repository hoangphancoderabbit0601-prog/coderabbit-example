import { CustomerMapper } from '@domain/mapper/customer';
import { CustomerRepository } from '@domain/repo';
import { errors } from '@factory';
import { messageApiError } from '@factory/_constant';
import { Position } from '@factory/customer';
import { NextFunction, Request, Response } from 'express';

import BaseController from './_base';

class CustomerController extends BaseController {
  private readonly customerRepository: CustomerRepository;

  constructor(db: SQLize) {
    super(db);
    this.customerRepository = new CustomerRepository(this.db);

    this.createCustomer = this.nextWrapper(this.createCustomer);
    this.deleteCustomer = this.nextWrapper(this.deleteCustomer);
    this.updateCustomer = this.nextWrapper(this.updateCustomer);
    this.getCustomer = this.nextWrapper(this.getCustomer);
  }

  public createCustomer = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    const data = CustomerMapper.toUserUpsert(req.body);
    const result = await this.customerRepository.createCustomer(data);
    this.created(res, {
      id: result.id.toString(),
    });
  };

  public updateCustomer = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    const updater = req.user;
    const userId = BigInt(req.params.id);
    if (
      updater.positionId !== Position.Administrator &&
      BigInt(updater.id) !== userId
    ) {
      throw new errors.NotFound();
    }
    const dataUpdate = CustomerMapper.toUserUpsert(req.body);
    const result = await this.customerRepository.updateCustomer(
      dataUpdate,
      userId,
    );
    res.json({
      id: result.id.toString(),
    });
  };

  public deleteCustomer = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    const updater = req.user;
    const idParam = req.params.id;
    if (updater.id.toString() === idParam) {
      throw new errors.BadRequestError(messageApiError.deleteError());
    }
    await this.customerRepository.deleteCustomer(idParam);
    this.noContent(res);
  };

  public getCustomer = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    const dto = CustomerMapper.toCustomerSearch(req.query);
    const data = await this.customerRepository.getCustomer(dto);
    res.json({
      total_count: data.count,
      customer: data.rows,
    });
  };
}

export default CustomerController;
