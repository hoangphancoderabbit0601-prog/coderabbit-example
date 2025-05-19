import { StatusCodes } from 'http-status-codes';
import { first } from 'lodash';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import isUndefined from 'lodash/isUndefined';
import { Ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { SCREEN_NAMES } from '@/constants';
import { logError } from '@/utils/logger';

import { useFlashMessageStorage } from './storage';

export const useErrorHandler = (
  err: Ref<any>,
  option?: {
    logout?: boolean;
    safeLeave?: Function;
  },
) => {
  const router = useRouter();
  const route = useRoute();

  const { setupFlashMessage, displayFlashMessage } = useFlashMessageStorage();

  const goto = (target: { name: string; query?: any }) => {
    if (typeof option?.safeLeave === 'function') {
      option.safeLeave();
    }
    router.push(target);
  };

  watch(err, () => {
    if (isNil(err.value)) return;

    if (!isUndefined(err.value.response)) {
      if (
        err.value.response.status === StatusCodes.BAD_REQUEST ||
        err.value.response.status === StatusCodes.UNPROCESSABLE_ENTITY
      ) {
        let text = '';
        const errors = err.value.response.data.errors;

        if (isArray(errors) && !isEmpty(errors)) {
          text = first(errors);
        } else if (typeof errors === 'string') {
          text = errors;
        } else if (typeof err.value.response.data.error === 'string') {
          text = err.value.response.data.error;
        } else if (typeof err.value.response.data.message === 'string') {
          text = err.value.response.data.message;
        }
        setupFlashMessage({ mode: 'danger', text });
      } else if (err.value.response.status === StatusCodes.OK) {
        const info = get(err.value, 'response.data.info', '');
        setupFlashMessage({
          mode: 'info',
          text: info,
        });
      } else if (err.value.response.status === StatusCodes.NOT_FOUND) {
        goto({ name: SCREEN_NAMES.NOT_FOUND });
      } else if (err.value.response.status === StatusCodes.UNAUTHORIZED) {
        if (option?.logout) return;

        const redirect =
          route.query.redirect || encodeURIComponent(route.fullPath);
        goto({ name: SCREEN_NAMES.LOGOUT, query: { redirect } });
      } else if (err.value.response.status === StatusCodes.FORBIDDEN) {
        goto({ name: SCREEN_NAMES.FORBIDDEN });
      } else {
        goto({ name: SCREEN_NAMES.INTERNAL_SERVER_ERROR });
      }
      displayFlashMessage();
    } else {
      goto({ name: SCREEN_NAMES.INTERNAL_SERVER_ERROR });
      logError(err.value);
    }
  });
};
