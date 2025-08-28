import { Position } from '@factory/customer';
import { RouteRecordRaw } from 'vue-router';

import { SCREEN_NAMES } from '@/constants';

export default <RouteRecordRaw[]>[
  {
    path: '/customer',
    component: () => import('@/layouts/AppLayout.vue'),
    meta: {
      auth: true,
    },
    children: [
      {
        path: 'list',
        name: SCREEN_NAMES.CUSTOMER_LIST,
        meta: {
          title: 'Customer List',
          permission: [Position.Administrator, Position.Group, Position.User],
        },
        component: () => import('@/pages/customer/customerList.vue'),
      },
      {
        path: ':id?',
        name: SCREEN_NAMES.CUSTOMER_ADD_EDIT_DELETE,
        meta: {
          title: 'CustomerAdd/ CustomerEdit',
          permission: [Position.Administrator],
        },
        component: () => import('@/pages/customer/customerAddEditDelete.vue'),
      },
    ],
  },
];
