import {
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  Model,
  UpdatedAt,
} from 'sequelize-typescript';

export class Common extends Model {
  @CreatedAt
  @Column({ field: 'created_date', type: DataType.DATE })
  createdDate!: Date;

  @UpdatedAt
  @Column({ field: 'updated_date', type: DataType.DATE })
  updatedDate!: Date;

  @DeletedAt
  @Column({ field: 'deleted_date', type: DataType.DATE })
  deletedDate?: Date;
}
