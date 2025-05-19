import { IUserInfo } from '@factory/auth';
import { Sequelize } from 'sequelize';

import * as models from '../model';

declare global {
  type ACTModels = typeof models;
  type ACTInstances = {
    [i in keyof typeof models]: InstanceType<ACTModels[i]>;
  };
  type SQLize = Sequelize & {
    models: ACTModels;
  };
  type AbstractRequest = {
    query: any;
    body: any;
    user?: IUserInfo;
  };
}
