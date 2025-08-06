import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  HasMany,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { Common } from './_common';
import { Order } from './order';

@Table({ tableName: 'customer', timestamps: true, paranoid: true })
export class Customer extends Common {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.BIGINT)
  id!: bigint;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  password!: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  name!: string;

  @AllowNull(false)
  @Column({ field: 'started_date', type: DataType.DATE })
  startedDate!: Date;

  @AllowNull(false)
  @Column({ field: 'position_id', type: DataType.TINYINT })
  positionId!: number;

  @HasMany(() => Order, 'customer_id')
  orders?: Order[];
}
