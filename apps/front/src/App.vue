<template>
  <router-view />
  <FlashMessage />
</template>

<script setup lang="ts">
import { provide, ref } from 'vue';

import FlashMessage from '@/components/FlashMessage.vue';
import { useApiClient } from '@/composables/client';
import { LOADING_UUIDS_STORAGE } from '@/symbols';

const loadingUuidsStorage = ref(new Set(''));
provide(LOADING_UUIDS_STORAGE, loadingUuidsStorage);

useApiClient();
</script>
