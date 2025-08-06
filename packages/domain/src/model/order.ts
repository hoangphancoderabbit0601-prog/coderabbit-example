import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { Common } from './_common';
import { Customer } from './customer';

@Table({
  tableName: 'order',
  timestamps: true,
  paranoid: true,
})
export class Order extends Common {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column({ field: 'order_id', type: DataType.BIGINT })
  orderId!: bigint;

  @AllowNull(false)
  @Column({ field: 'item_name', type: DataType.STRING(15) })
  itemName!: string;

  @AllowNull(true)
  @Column({ field: 'item_code', type: DataType.STRING(7) })
  itemCode?: string;

  @AllowNull(false)
  @Column({ field: 'item_quantity', type: DataType.INTEGER })
  itemQuantity!: number;

  @ForeignKey(() => Customer)
  @AllowNull(false)
  @Column({ field: 'customer_id', type: DataType.BIGINT })
  customerId!: bigint;

  @BelongsTo(() => Customer, 'customer_id')
  customer?: Customer;
}
