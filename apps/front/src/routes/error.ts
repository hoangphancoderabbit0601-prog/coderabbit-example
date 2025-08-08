import { RouteRecordRaw } from 'vue-router';

import { SCREEN_NAMES } from '@/constants';

export default <RouteRecordRaw>{
  path: '/error',
  hidden: true,
  children: [
    {
      name: SCREEN_NAMES.GENERAL,
      path: '/common-error',
      meta: { title: 'Commom' },
      component: () => import('@/pages/errors/GeneralError.vue'),
    },
  ],
};
