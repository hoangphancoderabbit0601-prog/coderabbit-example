import { RouteRecordRaw } from 'vue-router';

import { SCREEN_NAMES } from '@/constants';

export default <RouteRecordRaw>{
  path: '/error',
  component: () => import('@/layouts/AppLayout.vue'),
  hidden: true,
  children: [
    {
      name: SCREEN_NAMES.NOT_FOUND,
      path: '/not-found',
      meta: { title: '404 Not Found' },
      component: () => import('@/pages/errors/NotFound.vue'),
    },
    {
      name: SCREEN_NAMES.FORBIDDEN,
      path: '/forbidden',
      meta: { title: '403 Forbidden' },
      component: () => import('@/pages/errors/Forbidden.vue'),
    },
    {
      name: SCREEN_NAMES.INTERNAL_SERVER_ERROR,
      path: '/internal-server-error',
      meta: { title: '500 Internal Server Error' },
      component: () => import('@/pages/errors/Server.vue'),
    },
  ],
};
