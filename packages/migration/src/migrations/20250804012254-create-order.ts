import { DataTypes, literal, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) =>
    qi.createTable('order', {
      order_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dataTypes.BIGINT,
      },
      item_name: {
        allowNull: false,
        type: dataTypes.STRING(15),
      },
      item_code: {
        allowNull: true,
        type: dataTypes.STRING(7),
      },
      item_quantity: {
        allowNull: false,
        type: dataTypes.INTEGER,
      },
      customer_id: {
        allowNull: false,
        type: dataTypes.BIGINT,
        references: {
          model: 'customer',
          key: 'id',
        },
      },
      created_date: {
        allowNull: false,
        type: dataTypes.DATE,
        defaultValue: literal('CURRENT_TIMESTAMP'),
      },
      updated_date: {
        allowNull: false,
        type: dataTypes.DATE,
        defaultValue: literal('CURRENT_TIMESTAMP'),
      },
      deleted_date: {
        allowNull: true,
        type: dataTypes.DATE,
      },
    }),
  down: (qi: QueryInterface) => qi.dropTable('order'),
};
