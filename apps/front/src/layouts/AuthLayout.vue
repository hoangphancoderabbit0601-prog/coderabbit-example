<template>
  <div class="layout-container">
    <router-view />
    <FlashMessage />
  </div>
</template>

<style scoped lang="scss">
.layout-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f6f7fc;
}
</style>

<script setup lang="ts">
import FlashMessage from '@/components/FlashMessage.vue';
</script>
