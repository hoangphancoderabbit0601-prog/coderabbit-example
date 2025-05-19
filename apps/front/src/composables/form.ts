/* eslint-disable no-redeclare */
import dayjs from 'dayjs';
import cloneDeep from 'lodash/cloneDeep';
import entries from 'lodash/entries';
import first from 'lodash/first';
import isArray from 'lodash/isArray';
import isDate from 'lodash/isDate';
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import keys from 'lodash/keys';
import reduce from 'lodash/reduce';
import type { PartialDeep } from 'type-fest';
import { GenericObject, useField, useForm as ogUseForm } from 'vee-validate';
import { computed, MaybeRef, provide, reactive, Ref, ref, watch } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import { type ObjectSchema } from 'yup';

import { INPUT_SCREEN } from '@/symbols';

import useAlert from './alert';

export const useSearchForm = <T extends { [key: string]: any }>(
  defaultFormValue: T,
  parse: Partial<{
    [key in keyof T]: 'array' | 'date';
  }> = {},
) => {
  const formDefault: T = {
    ...defaultFormValue,
  };

  const formCurrent: T = {
    ...formDefault,
  };

  const route = useRoute();

  for (const key in formDefault) {
    if (!isUndefined(route.query[key])) {
      let result: any = route.query[key];

      switch (parse[key]) {
        case 'array':
          result =
            !isArray(result) && isString(result) ? result.split(',') : result;
          break;
        case 'date':
          result =
            dayjs(result).isValid() && isString(result)
              ? new Date(result)
              : result;
          break;
        default:
          result = !isNil(result) ? String(result) : result;
      }

      formCurrent[key] = result;
    }
  }

  const forms = reactive({
    default: cloneDeep(formDefault),
    current: cloneDeep(formCurrent),
  });

  function resetForm() {
    for (const key in forms.default) {
      forms.current[key] = forms.default[key];
    }
  }

  const searchValues = computed<{ [key in keyof T]: string }>(() => {
    const result: any = {};

    for (const [key, value] of entries(forms.current as any)) {
      let param: any = undefined;

      switch (parse[key]) {
        case 'array':
          param = isArray(value) ? value.join(',') : value;
          break;
        case 'date':
          param = isDate(value) ? dayjs(value).format('YYYY-MM-DD') : value;
          break;
        default:
          param = typeof value === 'number' ? value.toString() : value;
      }

      result[key] = param;
    }

    return result;
  });

  return {
    searchForms: forms,
    searchValues,
    resetForm,
  };
};

const scrollToError = () => {
  setTimeout(() => {
    const errElement = document.getElementsByClassName('border-red-600');
    if (!isNil(first(errElement))) {
      first(errElement)!.scrollIntoView({ block: 'center', inline: 'center' });
    }
  }, 100);
};

const dataFilter = <X, V extends keyof X>(input: X, refValue: X, allow?: V[]) =>
  reduce(
    <V[]>keys(input),
    (result: X, key) => {
      if (
        Object.prototype.hasOwnProperty.call(refValue, key) ||
        allow?.includes(key)
      ) {
        result[key] = input[key];
      }

      return result;
    },
    <X>{},
  );

export const useForm = <T extends GenericObject>(onLeaveHandler = true) => {
  const { confirm } = useAlert();

  const {
    meta,
    values,
    handleSubmit,
    setFieldValue,
    validateField,
    errors,
    resetForm,
  } = ogUseForm<T>();

  if (onLeaveHandler) {
    window.onbeforeunload = () => {
      if (meta.value.dirty) {
        return 'The information being edited will be discarded. <br> Are you sure?';
      }
    };

    onBeforeRouteLeave(async () => {
      if (meta.value.dirty) {
        const result = await confirm(
          'The information being edited will be discarded. <br> Are you sure?',
        );

        if (!result.isConfirmed) return false;
      }

      window.onbeforeunload = null;
      return true;
    });

    provide(INPUT_SCREEN, ref(true));
  }

  const isLeaving = ref(false);

  const safeLeave = () => {
    meta.value.dirty = false;
    window.onbeforeunload = null;
    isLeaving.value = true;
  };

  const setData = (data: T, allow?: (keyof T)[]) => {
    const filteredData: any = dataFilter(data, values, allow);
    resetForm({ values: filteredData });
  };

  function setDataOnLoaded(result: { data: T | null }): void;
  function setDataOnLoaded(
    result: { data: any },
    mapper: (input: any, viewScreen?: boolean) => T,
  ): void;
  function setDataOnLoaded(result: any, mapper?: any) {
    watch(
      () => result.data,
      () => {
        if (result.data) {
          if (mapper) setData(mapper(result.data, !onLeaveHandler));
          else setData(result.data);
        }
      },
    );
  }

  const isSubmitting = ref(false);

  const customHandleSubmit = (
    callback: (formModel: T) => Promise<void>,
    errorHandler: Parameters<typeof handleSubmit>[1],
  ) =>
    handleSubmit(async (formModel: T) => {
      if (isSubmitting.value) return;

      isSubmitting.value = true;

      const processedForm = { ...formModel };
      for (const key of Object.keys(formModel)) {
        if (processedForm[key] instanceof Array) {
          processedForm[key].forEach((d: any, i: number) => (d.sort = i + 1));
        }
      }

      await callback(processedForm);

      if (!isLeaving.value) {
        isSubmitting.value = false;
      }
    }, errorHandler);

  return {
    values,
    meta,
    errors,
    safeLeave,
    setData,
    setDataOnLoaded,
    scrollToError,
    handleSubmit: customHandleSubmit,
    setFieldValue,
    validateField,
    resetForm,
  };
};

export const useFormWithSchema = <T extends GenericObject>(
  schema: ObjectSchema<T>,
  onLeaveHandler = true,
  defineFields?: string[],
) => {
  const { confirm } = useAlert();

  const {
    meta,
    values,
    handleSubmit,
    errors,
    setFieldValue,
    validateField,
    resetForm,
    resetField,
    defineField,
    validate,
  } = ogUseForm<T>(schema ? { validationSchema: schema } : undefined);

  const fields = defineFields || Object.keys(schema.fields);
  const models = {} as any;
  for (const field of fields) {
    const [model] = defineField(field as any);
    models[field] = model;
  }

  if (onLeaveHandler) {
    window.onbeforeunload = () => {
      if (meta.value.dirty) {
        return 'The information being edited will be discarded. <br> Are you sure?';
      }
    };

    onBeforeRouteLeave(async () => {
      if (meta.value.dirty) {
        const result = await confirm(
          'The information being edited will be discarded. <br> Are you sure?',
        );

        if (!result.isConfirmed) return false;
      }

      window.onbeforeunload = null;
      return true;
    });

    provide(INPUT_SCREEN, ref(true));
  }

  const safeLeave = () => {
    resetForm({ values: values as any });
  };

  const setData = (data: PartialDeep<T>, allow?: (keyof PartialDeep<T>)[]) => {
    const filteredData: any = dataFilter(data, data, allow);
    resetForm({ values: filteredData });
  };

  function setDataOnLoaded(result: { data: PartialDeep<T> | null }): void;
  function setDataOnLoaded<X>(
    result: { data: X | null },
    mapper: (input: X, viewScreen?: boolean) => T,
  ): void;
  function setDataOnLoaded(result: any, mapper?: any) {
    watch(
      () => result.data,
      () => {
        if (result.data) {
          if (mapper) setData(mapper(result.data, !onLeaveHandler));
          else setData(result.data);
        }
      },
    );
  }

  const isSubmitting = ref(false);

  const customHandleSubmit = (
    callback: (formModel: T) => Promise<void>,
    errorHandler?: Parameters<typeof handleSubmit>[1],
  ) =>
    handleSubmit(async (formModel: T) => {
      if (isSubmitting.value) return;

      isSubmitting.value = true;

      const processedForm = { ...formModel };
      for (const key of Object.keys(formModel)) {
        if (processedForm[key] instanceof Array) {
          processedForm[key].forEach((d: any, i: number) => (d.sort = i + 1));
        }
      }

      await callback(processedForm);

      isSubmitting.value = false;
    }, errorHandler || scrollToError);

  return {
    values,
    meta,
    errors,
    safeLeave,
    setData,
    setDataOnLoaded,
    scrollToError,
    handleSubmit: customHandleSubmit,
    setFieldValue,
    validateField,
    resetForm,
    resetField,
    defineField,
    validate,
    models: models as { [X in keyof T]: Ref<T[X]> },
  };
};

export const useDateFromTo = <
  Q extends string,
  T extends { [key in `${Q}From` | `${Q}To`]?: any },
>(
  form: T,
  fieldName: Q,
) => {
  return {
    dateFromTo: computed({
      get: () => ({
        from: form[`${fieldName}From`],
        to: form[`${fieldName}To`],
      }),
      set: (value) => {
        if (!isUndefined(value.from)) {
          form[`${fieldName}From`] = value.from;
        }
        if (!isUndefined(value.to)) {
          form[`${fieldName}To`] = value.to;
        }
      },
    }),
  };
};

export const useSearchField = (
  model: MaybeRef<any>,
  ...params: Parameters<typeof useField>
) => {
  const composable = useField(...params);

  watch(model, (value) => {
    composable.value.value = value;
  });
  return composable;
};
