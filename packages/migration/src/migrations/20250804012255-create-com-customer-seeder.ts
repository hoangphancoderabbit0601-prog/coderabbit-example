import dayjs from 'dayjs';
import { Op, QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.bulkInsert('customer', [
      {
        id: 2,
        email: 'administrator@briswell-vn.com',
        password:
          '$2a$12$ZLA/0Ps74zFlDkerHnaV3Oo3EC0uCK5dNmtKwaBZxcsrJC9ulpFhe',
        name: 'COM Administrator',
        started_date: dayjs().subtract(2, 'month').toDate(),
        position_id: 0,
        created_date: dayjs().toDate(),
        updated_date: dayjs().toDate(),
        deleted_date: null,
      },
      {
        id: 3,
        email: 'group@briswell-vn.com',
        password:
          '$2a$12$ZLA/0Ps74zFlDkerHnaV3Oo3EC0uCK5dNmtKwaBZxcsrJC9ulpFhe',
        name: 'COM Group',
        started_date: dayjs().subtract(3, 'month').toDate(),
        position_id: 1,
        created_date: dayjs().toDate(),
        updated_date: dayjs().toDate(),
        deleted_date: null,
      },
      {
        id: 4,
        email: 'general@briswell-vn.com',
        password:
          '$2a$12$ZLA/0Ps74zFlDkerHnaV3Oo3EC0uCK5dNmtKwaBZxcsrJC9ulpFhe',
        name: 'COM General User',
        started_date: dayjs().subtract(4, 'month').toDate(),
        position_id: 2,
        created_date: dayjs().toDate(),
        updated_date: dayjs().toDate(),
        deleted_date: null,
      },
    ]);
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.bulkDelete('customer', {
      email: {
        [Op.in]: [
          'administrator@briswell-vn.com',
          'group@briswell-vn.com',
          'general@briswell-vn.com',
        ],
      },
    });
  },
};
