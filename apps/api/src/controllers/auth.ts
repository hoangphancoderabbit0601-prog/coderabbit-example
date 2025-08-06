import { AuthMapper } from '@domain/mapper';
import { AuthRepository } from '@domain/repo/auth';
import { NextFunction, Request, Response } from 'express';

import { signToken } from '../utils/jwt';
import BaseController from './_base';

class AuthController extends BaseController {
  private readonly authRepo: AuthRepository;

  constructor(db: SQLize) {
    super(db);
    this.authRepo = new AuthRepository(this.db);

    this.login = this.nextWrapper(this.login);
  }

  public login = async (req: Request, res: Response, _next: NextFunction) => {
    const data = AuthMapper.toLogin(req.body);
    const user = await this.authRepo.login(data);

    res.json({
      ...user,
      token: {
        accessToken: signToken({
          id: Number(user.id),
          name: user.name,
          positionId: Number(user.position_id),
        }),
      },
    });

    req.user = <any>user;
  };
}

export default AuthController;
