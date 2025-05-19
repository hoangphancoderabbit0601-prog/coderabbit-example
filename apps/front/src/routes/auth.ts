import { RouteRecordRaw } from 'vue-router';

import { SCREEN_NAMES } from '@/constants';

export default <RouteRecordRaw>{
  path: '/',
  component: () => import('@/layouts/AuthLayout.vue'),
  hidden: true,
  children: [
    {
      name: SCREEN_NAMES.LOGIN,
      path: '/login',
      meta: { title: 'Login', auth: false },
      component: () => import('@/pages/auth/Login.vue'),
    },
  ],
};
