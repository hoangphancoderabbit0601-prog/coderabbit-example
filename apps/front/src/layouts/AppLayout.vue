<template>
  <div class="layout-wrapper">
    <Header />
    <div class="layout-body">
      <Sidebar />
      <main id="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';
import { useFlashMessageStorage } from '@/composables';
import { SCREEN_NAMES } from '@/constants';

const route = useRoute();
const router = useRouter();

const { displayFlashMessage } = useFlashMessageStorage();

watch(
  () => route.name,
  async () => {
    try {
      displayFlashMessage();
    } catch (_err) {
      const redirect =
        route.query.redirect || encodeURIComponent(route.fullPath);

      router.push({ name: SCREEN_NAMES.LOGOUT, query: { redirect } });
    }
  },
  { immediate: true },
);
</script>

<style lang="scss">
.layout-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.layout-body {
  display: flex;
  flex: 1;
}

#content {
  flex: 1;
  padding: 2rem;
  margin-top: 60px;
  margin-left: 240px;
  transition: all 0.3s;
}

@media (max-width: 768px) {
  #content {
    margin-left: 0;
  }
}
</style>
