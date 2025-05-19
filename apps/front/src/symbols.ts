import { InjectionKey, Ref } from 'vue';

import { AbstractApiClient } from './composables/client';

export const DISABLED: InjectionKey<Ref<boolean>> = Symbol('disable');
export const VIEW_SCREEN: InjectionKey<Ref<boolean>> = Symbol('view_screen');
export const INPUT_SCREEN: InjectionKey<Ref<boolean>> = Symbol('input_screen');
export const LOADING: InjectionKey<Ref<boolean>> = Symbol('loading');
export const EDIT_SCREEN: InjectionKey<boolean> = Symbol('edit_screen');

export const API_CLIENT: InjectionKey<AbstractApiClient> = Symbol('api.client');

export const LOADING_UUIDS_STORAGE: InjectionKey<Ref<Set<string>>> = Symbol(
  'loading_uuids_storage',
);
