import { messages } from '@factory';
import dayjs from 'dayjs';
import isNil from 'lodash/isNil';
import some from 'lodash/some';
import { Ref } from 'vue';
import { addMethod, setLocale, string, StringSchema } from 'yup';

import { enum2SelectOptions } from './utils/typescript';

export const setupCustomValidator = () => {
  setLocale({
    mixed: {
      required: ({ label }) => messages.required(label),
    },
    string: {
      max: ({ label, max }) => messages.lengthExceeded(label, String(max)),
    },
  });

  addMethod<StringSchema>(string, 'emailAddress', function () {
    return this.test((value, { createError, path }) => {
      if (!value) return true;

      const regex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (!regex.test(value) || value.toString().length !== value.length) {
        return createError({
          path,
          message: messages.emailAddressFormatError('${label}'),
        });
      }

      return true;
    });
  });

  addMethod<StringSchema>(string, 'katakana', function () {
    // eslint-disable-next-line no-irregular-whitespace
    return this.matches(/^([ァ-ン]|[ー 　ヴ])+$/, {
      excludeEmptyString: true,
      message: messages.nonKatakanaInputError('${label}'),
    });
  });

  addMethod<StringSchema>(string, 'password', function () {
    return this.matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
      excludeEmptyString: true,
      message: messages.passwordError,
    });
  });

  addMethod<StringSchema>(
    string,
    'isFormattedDate',
    function (format = 'YYYY-MM-DD') {
      return this.test((value, { createError, path }) => {
        if (isNil(value) || value === '') {
          return true;
        }

        return (
          dayjs(value, format, true).isValid() ||
          createError({ path, message: '有効な日付を入力してください' })
        );
      });
    },
  );

  addMethod<StringSchema>(
    string,
    'isIn',
    function (e, options?: { valueIsString?: boolean }) {
      const { valueIsString = false } = options ?? {};
      const selectOptions = enum2SelectOptions(e, { valueIsString });
      return this.test((value, { createError, path }) => {
        if (isNil(value) || value === '') return true;

        const isValid = some(selectOptions, (option) => option.value == value);

        return (
          isValid ||
          createError({
            path,
            message: '再度選択してください。',
          })
        );
      });
    },
  );

  addMethod<StringSchema>(
    string,
    'sameAs',
    function (field: Ref<any>, message?: string) {
      return this.test((value, { createError, path }) => {
        if (value === null || value === undefined || value === '') return true;

        if (value !== field.value)
          return createError({
            path,
            message:
              message ||
              messages.inputMismatchError('${label}', '${label}確認'),
          });

        return true;
      });
    },
  );

  addMethod<StringSchema>(
    string,
    'compareDateFromAndTo',
    function (field: Ref<any>, message?: string) {
      return this.test((value, { createError, path }) => {
        const dateFrom = value ? dayjs(value) : null;
        const dateTo = field.value ? dayjs(field.value) : null;

        if (dateFrom === null || dateTo === null) {
          return true;
        }

        if (dateFrom.isAfter(dateTo)) {
          return createError({
            path,
            message:
              message ||
              messages.inputMismatchError('${label}', '${label}確認'),
          });
        }

        return true;
      });
    },
  );

  addMethod<StringSchema>(
    string,
    'compareDateToAndFrom',
    function (field: Ref<any>, message?: string) {
      return this.test((value, { createError, path }) => {
        const dateTo = value ? dayjs(value) : null;
        const dateFrom = field.value ? dayjs(field.value) : null;

        if (dateFrom === null || dateTo === null) {
          return true;
        }

        if (dateTo.isBefore(dateFrom)) {
          return createError({
            path,
            message:
              message ||
              messages.inputMismatchError('${label}', '${label}確認'),
          });
        }

        return true;
      });
    },
  );

  addMethod<StringSchema>(string, 'dateISO', function () {
    return this.test((value, { createError, path }) => {
      if (isNil(value) || value === '') {
        return true;
      }

      return (
        dayjs(new Date(<string>value)).isValid() ||
        createError({ path, message: messages.typeError('${label}', '日付') })
      );
    });
  });
};

export const v = () => string().nullable();
