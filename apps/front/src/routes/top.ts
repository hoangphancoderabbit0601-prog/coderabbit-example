import { RouteRecordRaw } from 'vue-router';

import { SCREEN_NAMES } from '@/constants';

export default <RouteRecordRaw[]>[
  {
    path: '',
    component: () => import('@/layouts/AppLayout.vue'),
    meta: {
      auth: true,
    },
    children: [
      {
        path: '',
        name: SCREEN_NAMES.TOP,
        meta: {
          title: 'Top',
          permission: [0, 1, 2, 3],
        },
        component: () => import('@/pages/top/Top.vue'),
      },
    ],
  },
];
