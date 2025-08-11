<template>
  <header class="header flex justify-between items-center">
    <div class="logo">
      <router-link :to="{ name: 'top' }">Briswell</router-link>
    </div>

    <div class="flex items-center h-full">
      <div style="align-items: center" class="flex h-full">
        <h1 class="mx-2 font-bold">{{ userInfo?.name ?? '' }}</h1>
      </div>
      <div>
        <h1
          @click="clickLogout"
          class="mx-2 font-bold text-blue-500 cursor-pointer"
        >
          Logout
        </h1>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';

import { useAppStorage } from '@/composables';

const router = useRouter();
const { logout, userInfo } = useAppStorage();

const clickLogout = () => {
  logout();
  router.push({ name: 'login' });
};
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 0 20px;
  box-shadow: 0px 2px 20px rgba(1, 41, 112, 0.1);

  .logo a {
    font-size: 24px;
    font-weight: 700;
    color: var(--primary-color);
  }

  .p-avatar {
    width: 36px;
    height: 36px;
  }
}
</style>
