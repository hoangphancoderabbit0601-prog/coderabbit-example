import 'primeicons/primeicons.css';
import './assets/index.css';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import PrimeVue from 'primevue/config';
import { createApp } from 'vue';

import install from '@/install';
import { setupCustomValidator } from '@/validator';

import App from './App.vue';
import Noir from './presets/Noir';
import router from './router';

setupCustomValidator();
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Tokyo');

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: Noir,
    options: {
      prefix: 'p',
      darkModeSelector: '.p-dark',
      cssLayer: false,
    },
  },
});

install(app);
app.use(router);

app.mount('#app');
