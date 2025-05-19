<template>
  <h3 class="card-title py-md-3 mb-0">{{ title }}</h3>
  <hr class="pb-4" />
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, default: '' },
});
</script>

<style lang="scss">
.card-title {
  padding: 20px 0 15px 20px;
  font-size: 28px;
  font-weight: 500;
  color: var(--blue-color);

  span {
    color: #899bbd;
    font-size: 14px;
    font-weight: 400;
  }
}
</style>
