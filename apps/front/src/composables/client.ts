import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import last from 'lodash/last';
import omitBy from 'lodash/omitBy';
import { inject, provide, reactive, Ref, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { messages } from '@/constants';
import { IFetchOptions } from '@/services/_base';
import { API_ENDPOINT } from '@/settings';
import { API_CLIENT } from '@/symbols';

import { useAppStorage, useFlashMessageStorage } from './storage';

export abstract class AbstractApiClient {
  abstract fetch<T>(fetchOption: IFetchOptions): Promise<AxiosResponse<T>>;
}

export const useApiClient = () => {
  const { accessToken } = useAppStorage();

  class ApiClient extends AbstractApiClient {
    /**
     * main function to call API
     * @param {object} fetchOption custom option when run API
     */
    public async fetch<T>(
      fetchOption: IFetchOptions,
    ): Promise<AxiosResponse<T>> {
      try {
        const axiosOption: AxiosRequestConfig = {
          baseURL: fetchOption.endpoint ?? API_ENDPOINT,
          url: fetchOption.url,
          method: fetchOption.method ?? 'GET',
          data: fetchOption.data,
          validateStatus: (status: StatusCodes) =>
            status === fetchOption.expectedStatusCode,
          params: fetchOption.params,
          headers: {},
        };

        // no need access token when login
        if (fetchOption.noAuth !== true) {
          axiosOption.headers!['Authorization'] = `Bearer ${accessToken.value}`;
        }
        if (!isNil(fetchOption.headers)) {
          axiosOption.headers = {
            ...axiosOption.headers,
            ...fetchOption.headers,
          };
        }

        return await Axios(axiosOption);
      } catch (err: any) {
        // accessToken has expired
        if (
          !isNil(err.response) &&
          err.response.status === StatusCodes.UNAUTHORIZED &&
          fetchOption.revoke !== false
        ) {
          const newFetchOption = { ...fetchOption, revoke: false };

          // request again, if error still happen -> abort
          return this.fetch<T>(newFetchOption);
        } else {
          throw err;
        }
      }
    }
  }

  const client = new ApiClient();
  provide(API_CLIENT, client);
};

/**
 * query composable but skip first call
 * useful for handle query on button click
 * @param fetcher service function of api client
 * @param params params to pass to fetcher
 * @returns composable data
 */
export function useLazyQuery<
  Q extends (...args: any[]) => Promise<{ data: any }>,
  T extends () => any,
>(fetcher: Q, ...params: Parameters<Q | T> | []) {
  const isPopup = inject('isPopup', false);

  const router = useRouter();
  const route = useRoute();
  const isLoading = ref(false);

  const result: {
    count: number;
    data: AsyncReturnType<Q>['data'] | null;
  } = reactive({ count: 0, data: null });

  const error: Ref<any> = ref(null);
  const client = inject(API_CLIENT)!;

  async function refetch(
    ...newParams:
      | [...Parameters<Q | T>, { changeRoute?: boolean }]
      | Parameters<Q | T>
      | { changeRoute?: boolean }[]
      | []
  ) {
    error.value = null;
    isLoading.value = true;
    let defaultNewParam: any = [...newParams];
    try {
      let fetchArgs = isEmpty(newParams) ? params : newParams;

      const option: { changeRoute: boolean } = last(newParams);

      let changeRoute = true;
      if (!isNil(option.changeRoute)) {
        changeRoute = option.changeRoute;
        const newArgs = newParams.splice(0, newParams.length - 1);
        fetchArgs = !isEmpty(newArgs) ? newArgs : params;
      }

      const apiResult = await fetcher.bind(client)(...fetchArgs);
      result.data = apiResult.data;
      result.count = Number((<any>apiResult).headers['x-total-count']);

      if (!isPopup && changeRoute) {
        // remove data undefined or null
        const newFetchArgs = omitBy(fetchArgs[0], isNil);

        router.push({
          name: route.name!,
          query: newFetchArgs, // search api usually have only 1 fetch params
        });
      }
    } catch (err) {
      error.value = err;
      error.value.refetchApi = {
        refetch: function () {
          return refetch(...defaultNewParam);
        },
      };
    }
    isLoading.value = false;
  }

  return { result, refetch, isLoading, error };
}

/**
 * query composable that call api immediately after initiate
 * useful for handle query of search/view screen
 * @param fetcher service function of api client
 * @param params params to pass to fetcher
 * @returns composable data
 */
export function useQuery<
  Q extends (...args: any[]) => Promise<{ data: any }>,
  T extends () => any,
>(this: any, fetcher: Q, ...params: Parameters<Q | T>) {
  const { result, refetch, isLoading, error } = useLazyQuery.bind(this)(
    fetcher,
    ...params,
  );

  refetch({ changeRoute: false });

  return { result, refetch, isLoading, error };
}

export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any;

// mimic apollo client composables
// for easier intergrating later
export function useMutation<
  Q extends (...args: any[]) => Promise<{ data: any }>,
  T extends () => any,
>(mutator: Q, ...params: Parameters<Q | T>) {
  const isLoading = ref(false);
  const flashText: Ref<string | null> = ref(messages.saveSuccess);
  const result: Ref<AsyncReturnType<Q>['data'] | null> = ref(null);
  const error: Ref<any> = ref(null);

  const client = inject(API_CLIENT)!;

  const { setupFlashMessage } = useFlashMessageStorage();

  const mutate = async (...newParams: Parameters<Q | T>) => {
    isLoading.value = true;
    error.value = null;
    try {
      const args = isEmpty(newParams) ? params : newParams;
      const apiResult = await mutator.bind(client)(...args);
      result.value = apiResult.data;
      if (flashText.value) {
        setupFlashMessage({
          mode: 'success',
          text: flashText.value,
        });
      }
    } catch (err) {
      error.value = err;
    }

    isLoading.value = false;
    return result.value;
  };

  const disableFlashMessage = () => {
    flashText.value = null;
  };

  return { result, mutate, isLoading, error, flashText, disableFlashMessage };
}
