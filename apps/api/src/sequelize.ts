import * as models from '@domain/model';
import { Sequelize } from 'sequelize-typescript';

import {
  DB_HOST as host,
  DB_NAME as database,
  DB_PASS as password,
  DB_PORT as port,
  DB_USER as username,
} from './LoadEnv';

const createClient = async () => {
  const sequelize = new Sequelize({
    host,
    port,
    username,
    password,
    database,
    dialect: 'mysql',
    dialectOptions: {
      decimalNumbers: true,
    },
    benchmark: true,
    logging: (sql, time) => {
      console.log(`${sql.replace(/\s\s+/g, ' ')} (took ${time}ms)`);
    },
    models: Object.values(models),
  });

  sequelize
    .authenticate()
    .then(() => {
      console.log('MySQL server connected');
    })
    .catch((err: any) => {
      console.log(`MySQL connection error ${err}`);
      process.exit(1);
    });

  return sequelize as unknown as SQLize;
};

export default createClient;
