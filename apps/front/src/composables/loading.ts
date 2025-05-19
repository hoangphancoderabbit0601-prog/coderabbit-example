import { v4 as uuidv4 } from 'uuid';
import { computed, inject, onBeforeUnmount, Ref, watch } from 'vue';

import { LOADING_UUIDS_STORAGE } from '@/symbols';

export const useLoading = (...isAnyLoading: Array<Ref<boolean>>) => {
  const uuid = uuidv4();
  const loadingUuids = inject(LOADING_UUIDS_STORAGE)!;

  const watchTarget = computed(() => {
    for (const loading of isAnyLoading) {
      if (loading.value) return true;
    }
    return false;
  });

  watch(
    watchTarget,
    (current) => {
      if (current) {
        loadingUuids.value.add(uuid);
      } else {
        loadingUuids.value.delete(uuid);
      }
    },
    { immediate: true },
  );

  onBeforeUnmount(() => loadingUuids.value.delete(uuid));
};
