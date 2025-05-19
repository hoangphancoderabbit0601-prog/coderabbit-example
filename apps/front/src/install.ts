import { App } from 'vue';

import PageTitle from '@/atoms/PageTitle.vue';

export default (app: App) => {
  app.component('PageTitle', PageTitle);
};
