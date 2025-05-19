<template>
  <header class="header flex justify-between items-center">
    <div class="logo">
      <router-link :to="{ name: 'top' }">Briswell</router-link>
    </div>

    <div class="flex items-center">
      <Avatar
        image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
        class="mr-2 cursor-pointer"
        shape="circle"
        @click="toggle"
      />
      <Menu ref="menu" :model="items" :popup="true" />
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { useAppStorage } from '@/composables';

const router = useRouter();
const { logout } = useAppStorage();

const menu = ref();
const toggle = (event) => {
  menu.value.toggle(event);
};

const items = ref([
  {
    label: 'Profile',
    items: [
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
          logout();
          router.push({ name: 'login' });
        },
      },
    ],
  },
]);
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
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
