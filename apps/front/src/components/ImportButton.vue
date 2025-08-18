<template>
  <form @submit.prevent="onSubmit">
    <div class="flex flex-row justify-between items-center gap-4">
      <Button
        type="submit"
        severity="contrast"
        label="CSV取込"
        class="mt-4 w-full justify-end"
      />
      <div class="flex flex-col gap-4 w-full">
        <input
          type="file"
          name="file"
          id="file"
          accept=".csv"
          @change="handleFileChange"
        />
        <Message
          v-if="errors.file"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ errors.file }}
        </Message>
      </div>
    </div>
  </form>
</template>
<script setup lang="ts">
import Button from 'primevue/button';
import Message from 'primevue/message';
import { ref } from 'vue';

import {
  useErrorHandler,
  useFlashMessageStorage,
  useMutation,
} from '@/composables';
import { orderService } from '@/services';

const selectedFile = ref<File | null>(null);
const errors = ref<{ file?: string }>({});

const emit = defineEmits<{
  (e: 'refresh-data'): void;
}>();

const { showFlashMessage } = useFlashMessageStorage();

const {
  mutate,
  error: errorMutation,
  result,
} = useMutation(orderService.importOrders);
useErrorHandler(errorMutation);
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      errors.value.file = 'CSVファイルを選択してください。';
      selectedFile.value = null;
      return;
    }

    selectedFile.value = file;
    errors.value.file = '';
  }
};

const onSubmit = async () => {
  if (!selectedFile.value) {
    errors.value.file = 'ファイルを選択してください。';
    return;
  }

  try {
    await mutate(selectedFile.value);

    if (result.value) {
      emit('refresh-data');
      showFlashMessage({
        mode: 'success',
        text: 'CSV取り込みが完了しました。',
      });

      // Reset form
      selectedFile.value = null;
      errors.value.file = '';
      const fileInput = document.getElementById('file') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }
  } catch (_error) {
    showFlashMessage({
      mode: 'danger',
      text: 'CSV取り込み中にエラーが発生しました。',
    });
  }
};
</script>
