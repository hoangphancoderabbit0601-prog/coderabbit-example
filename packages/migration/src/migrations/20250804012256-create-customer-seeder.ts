import dayjs from 'dayjs';
import { QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.bulkInsert('customer', [
      {
        id: 1,
        email: 'hieuldm@briswell-vn.com',
        password:
          '$2a$12$ZLA/0Ps74zFlDkerHnaV3Oo3EC0uCK5dNmtKwaBZxcsrJC9ulpFhe',
        name: 'HieuLDM',
        started_date: dayjs().subtract(1, 'month').toDate(),
        position_id: 0,
        created_date: dayjs().toDate(),
        updated_date: dayjs().toDate(),
        deleted_date: null,
      },
    ]);
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.bulkDelete('customer', {
      email: 'hieuldm@briswell-vn.com',
    });
  },
};
