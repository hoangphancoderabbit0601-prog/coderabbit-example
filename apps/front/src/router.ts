import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import { useAppStorage } from '@/composables/storage';

import { SCREEN_NAMES } from './constants';

const routes: RouteRecordRaw[] = [];

const InstalledAppRoutes: any = import.meta.glob('./routes/*.ts', {
  eager: true,
});

for (const App in InstalledAppRoutes) {
  const AppRoutes = InstalledAppRoutes[App];
  if (AppRoutes.default instanceof Array) {
    routes.push(...AppRoutes.default);
  } else {
    routes.push(AppRoutes.default);
  }
  routes.push({
    path: '/:pathMatch(.*)*',
    meta: { title: '404 Not Found' },
    redirect: { name: 'not-found' },
  });
}

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to, _from) => {
  const { title } = to.meta;
  document.title = title ? `${title}` : 'Intern Project';

  const auth =
    to.meta.auth !== null || to.meta.auth !== undefined ? to.meta.auth : true;

  const { loggedIn, hasExpired, havePermission } = useAppStorage();

  if (auth && (!loggedIn.value || hasExpired())) {
    const redirectUrl = to.query.redirect || encodeURIComponent(to.fullPath);
    return { name: SCREEN_NAMES.GENERAL, query: { redirectUrl } };
  }

  if (auth && !havePermission(to.meta?.permission as number[])) {
    return { name: SCREEN_NAMES.GENERAL };
  }

  return true;
});

export default router;
