import { Position } from '@factory/customer';
import { RouteRecordRaw } from 'vue-router';

import { SCREEN_NAMES } from '@/constants';

export default <RouteRecordRaw[]>[
  {
    path: '/order',
    component: () => import('@/layouts/AppLayout.vue'),
    meta: {
      auth: true,
    },
    children: [
      {
        path: 'list',
        name: SCREEN_NAMES.ORDER_LIST,
        meta: {
          title: 'Order List',
          permission: [Position.Administrator],
        },
        component: () => import('@/pages/order/order.vue'),
      },
    ],
  },
];
