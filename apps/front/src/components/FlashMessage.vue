<template>
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-4"
  >
    <div
      v-if="visible"
      class="flash-message fixed top-4 transform z-50 max-w-lg w-[90%] rounded-md px-6 py-4 text-white shadow-lg border-2 border-solid transition-all"
      :class="flashClass"
    >
      <Button
        type="button"
        class="absolute top-2 right-2 text-white text-sm"
        @click.prevent="clearFlashMessage"
      >
        ×
      </Button>
      <span
        class="pl-4 font-bold"
        v-if="localMessage"
        v-html="displayMessage"
      ></span>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';

import { useFlashMessageStorage } from '@/composables/storage';

let autoclose: ReturnType<typeof setTimeout> | undefined = undefined;
const { message, visible, clearFlashMessage } = useFlashMessageStorage();
let localMessage = ref({ ...message.value });

const displayMessage = computed(
  () => localMessage.value.text?.replace('\n', '<br>') || '',
);

const flashClass = computed(() => {
  let classStyle = 'bg-danger';
  if (localMessage.value?.mode === 'danger') {
    classStyle = 'bg-danger';
  }
  if (localMessage.value?.mode === 'success') {
    classStyle = 'bg-success';
  }
  if (localMessage.value?.mode === 'info') {
    classStyle = 'bg-info';
  }

  return classStyle;
});

watch(visible, () => {
  if (visible.value) {
    localMessage.value = { ...message.value };
    if (autoclose !== undefined) {
      clearTimeout(autoclose);
    }

    autoclose = setTimeout(() => {
      clearFlashMessage();
      autoclose = undefined;
    }, 5000);
  }
});

onBeforeUnmount(clearFlashMessage);
</script>
