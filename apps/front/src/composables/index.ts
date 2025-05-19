import isNull from 'lodash/isNull';
import { computed, inject, ref } from 'vue';

import { DISABLED, LOADING, VIEW_SCREEN } from '@/symbols';

export { useLazyQuery, useMutation, useQuery } from './client';
export { useErrorHandler } from './errorHandler';
export { useAppStorage, useFlashMessageStorage } from './storage';
export { useDateFromTo, useForm, useSearchForm } from '@/composables/form';

export const useAtoms = (props: {
  [key in 'disabled' | 'loading']?: any;
}) => {
  const isViewScreen = inject(VIEW_SCREEN, ref(false));

  const isDisabled = isNull(props.disabled)
    ? isViewScreen.value
      ? isViewScreen
      : inject(DISABLED, isViewScreen)
    : computed(() => props.disabled);

  const isLoading = !isNull(props.loading)
    ? computed(() => props.loading)
    : inject(LOADING, ref(false));

  return { isDisabled, isLoading, isViewScreen };
};
