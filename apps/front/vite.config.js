import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [PrimeVueResolver()],
      dts: './src/@types/components.d.ts'
    }),
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
      {
        find: '@factory',
        replacement: path.resolve(__dirname, '../../packages/factory/src'),
      },
    ],
  },
});
