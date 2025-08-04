import { DataTypes, literal, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) =>
    qi.createTable('customer', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dataTypes.BIGINT,
      },
      email: {
        allowNull: false,
        type: dataTypes.STRING(255),
      },
      password: {
        allowNull: false,
        type: dataTypes.STRING(255),
      },
      name: {
        allowNull: false,
        type: dataTypes.STRING(100),
      },
      started_date: {
        allowNull: false,
        type: dataTypes.DATE(),
      },
      position_id: {
        allowNull: false,
        type: dataTypes.TINYINT,
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
  down: (qi: QueryInterface) => qi.dropTable('customer'),
};
