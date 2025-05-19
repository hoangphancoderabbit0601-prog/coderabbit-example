import { IUserInfo } from '@factory/auth';
import {
  createGlobalState,
  createSharedComposable,
  StorageSerializers,
  useLocalStorage,
} from '@vueuse/core';
import Axios, { AxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';
import isNil from 'lodash/isNil';
import omit from 'lodash/omit';
import some from 'lodash/some';
import { computed, ref } from 'vue';

import { API_ENDPOINT, REFRESH_TOKEN_TIMEOUT } from '@/settings';

type UserInfo = IUserInfo & {
  expiredAt?: string;
};

export type Permission =
  | string
  | string[]
  | number
  | number[]
  | undefined
  | null;

export const useAppStorage = createSharedComposable(() => {
  const accessToken = useLocalStorage<string>('accessToken', '');

  const userInfo = computed<UserInfo | null>(() => {
    if (isNil(accessToken.value) || accessToken.value === '') {
      return null;
    }

    const decoded = jwtDecode<{
      id: number;
      name: string;
      positionId: number;
      exp: number;
      [key: string]: any;
    }>(accessToken.value);

    return {
      id: decoded.sub,
      ...omit(decoded, 'sub', 'exp'),
      expiredAt: decoded.exp * 1000,
    } as unknown as UserInfo;
  });

  const loggedIn = computed(() => !isNil(userInfo.value));

  function hasExpired() {
    if (isNil(userInfo.value)) {
      return true;
    }

    if (isNil(userInfo.value.expiredAt)) {
      return true;
    }

    return dayjs(userInfo.value.expiredAt).isBefore(dayjs(new Date()));
  }

  const havePermission = (positions: Array<number>) => {
    if (!positions) {
      return true;
    }

    if (!loggedIn.value) {
      return false;
    }

    return some(
      positions,
      (position) => position === userInfo.value!.positionId,
    );
  };

  const setExpiration = () => {
    if (userInfo.value === null) return;
    userInfo.value.expiredAt = dayjs
      .tz(new Date())
      .add(REFRESH_TOKEN_TIMEOUT, 'minutes')
      .format('YYYY-MM-DD HH:mm:ss');
  };

  const logout = () => {
    accessToken.value = null;
  };

  let isSynching = false;
  const resolvers: Function[] = [];
  const resolverExecuter = () => {
    while (resolvers.length > 0) {
      resolvers.pop()?.();
    }
  };
  const waitForSync = () =>
    new Promise((resolve) => {
      resolvers.push(resolve);
    });

  const sync = async () => {
    if (!isSynching) {
      isSynching = true;
      try {
        if (userInfo.value) {
          const axiosOption: AxiosRequestConfig = {
            baseURL: API_ENDPOINT,
            url: `/auth/${userInfo.value?.id}`,
            method: 'GET',
            headers: {},
          };

          axiosOption.headers!.Authorization = `JWT ${accessToken.value}`;

          const credentials = await Axios(axiosOption);

          const newToken = credentials.data.token;
          accessToken.value = newToken;
        }

        isSynching = false;
        resolverExecuter();
      } catch (_err) {
        isSynching = false;
        accessToken.value = undefined;
        resolverExecuter();
      }
    } else {
      await waitForSync();
    }
  };

  return {
    accessToken,
    userInfo,
    loggedIn,
    logout,
    hasExpired,
    havePermission,
    setExpiration,
    sync,
  };
});

export type FlashMessageMode = 'danger' | 'warning' | 'success' | 'info' | '';

export interface MessageConfig {
  mode: FlashMessageMode;
  text?: string;
}

export const useFlashMessageStorage = createSharedComposable(() => {
  const message = useLocalStorage<MessageConfig | null>(
    'app.flash.message',
    null,
    { serializer: StorageSerializers.object },
  );
  const visible = ref(false);

  const clearFlashMessage = () => {
    message.value = null;
    visible.value = false;
  };

  const setupFlashMessage = (config: MessageConfig) => {
    clearFlashMessage();
    message.value = config;
  };

  // may need to wait for setup to complete
  const displayFlashMessage = (timer = 10) => {
    if (message.value === null) return;
    setTimeout(() => (visible.value = true), timer);
    setTimeout(() => (message.value = null), 300);
  };

  const showFlashMessage = (config: MessageConfig) => {
    setupFlashMessage(config);
    displayFlashMessage();
  };

  return {
    message,
    visible,
    clearFlashMessage,
    setupFlashMessage,
    displayFlashMessage,
    showFlashMessage,
  };
});

// Global flag check if is any login tab open
export const useGlobalState = createGlobalState(() =>
  useLocalStorage('app.is.any.login.tab.open', false),
);
