import dayjs from 'dayjs';
import { isEmpty, isNil } from 'lodash';
import * as yup from 'yup';

import { messageApiError, messages } from './_constant';

const ACCEPTED_DATE_FORMAT = ['YYYY/MM/DD'];

const ACCEPTED_DATETIME_FORMAT = [
  'YYYY-M-D H:m:s',
  'YYYY/M/D H:m:s',
  'YYYY-MM-DD HH:mm:ss',
  'YYYY/MM/DD HH:mm:ss',
];

export const setupCustomValidator = () => {
  yup.setLocale({
    mixed: {
      required: ({ label }) => messages['E-CL-VAL-001'](label),
    },
    string: {
      min: ({ label, min, value }) =>
        messages['E-CL-VAL-003'](label, min, value.length),
      max: ({ label, max, value }) =>
        messages['E-CL-VAL-002'](label, max, value.length),
      url: () => messages.effectivenessError('URL'),
    },
    number: {
      max: ({ label, max }) => messages.valueExceeded(label, max),
    },
  });

  yup.addMethod(yup.string, 'integer', function () {
    return this.matches(/^-?\d+$/, {
      excludeEmptyString: true,
      message: messages.typeError('${label}', '数値と"-"'),
    });
  });

  yup.addMethod(yup.number, 'positiveInteger', function () {
    return this.test((value, { createError, path, originalValue }) => {
      if (isNil(value)) return true;
      if (/^\d+$/.test(originalValue)) return true;
      return createError({
        path,
        message: messages.typeError('${label}', '数値'),
      });
    });
  });

  yup.addMethod(
    yup.number,
    'maxLength',
    function (length: number, customerMessage?: string) {
      return this.test((value, { createError, path }) => {
        if (isNil(value)) return true;
        if (Math.abs(value) < Math.pow(10, length)) return true;
        return createError({
          path,
          message:
            customerMessage || messages.lengthExceeded('${label}', length),
        });
      });
    },
  );

  yup.addMethod(yup.string, 'decimal', function () {
    return this.matches(/^-?(\d+\.)?\d+$/, {
      excludeEmptyString: true,
      message: messages.typeError('${label}', '数値と"."と"-"'),
    });
  });

  yup.addMethod(yup.string, 'positiveDecimal', function () {
    return this.matches(/^(\d+\.)?\d+$/, {
      excludeEmptyString: true,
      message: messages.typeError('${label}', '数値と"."'),
    });
  });

  yup.addMethod(yup.string, 'decimal101', function () {
    return this.matches(/^-?([\d]{1,9})?(\.[\d]{1,1})?$/, {
      message: messages.decimalError('${label}', 9, 1),
    });
  });

  yup.addMethod(yup.string, 'phonenumber', function () {
    return this.matches(/^[0-9-]*$/, {
      message: messages.typeError('${label}', '数値と"-"'),
    });
  });

  yup.addMethod(yup.string, 'hiragana', function () {
    // eslint-disable-next-line no-irregular-whitespace
    return this.matches(/^[ぁ-ゔゞ゛゜ー 　]*$/, {
      excludeEmptyString: true,
      message: messages.typeError('${label}', 'ひらがなと全角半角スペース'),
    });
  });

  yup.addMethod(yup.string, 'alphanumeric', function () {
    return this.matches(/^[a-zA-Z0-9]*$/, {
      excludeEmptyString: true,
      message: messages.typeError('${label}', '英数字'),
    });
  });

  yup.addMethod(yup.string, 'halfWidthKatakana', function () {
    return this.matches(/^[ｧ-ﾝﾞﾟ]*$/, {
      excludeEmptyString: true,
      message: messages.typeError('${label}', '半角カタカナ'),
    });
  });

  yup.addMethod(yup.string, 'password', function () {
    return this.matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\-!?@#$%&=+*]{8,}$/, {
      excludeEmptyString: true,
      message: messages.passwordError,
    });
  });

  yup.addMethod(yup.string, 'validDate', function () {
    return this.test((value, { createError, path }) => {
      if (value === null || value === undefined || value === '') {
        return true;
      }

      const matched = ACCEPTED_DATE_FORMAT.some((format) => {
        const parsedDate = dayjs(value, format, true);
        return parsedDate.isValid() && parsedDate.format(format) === value;
      });

      return (
        matched ||
        createError({ path, message: messageApiError.formatError('${label}') })
      );
    });
  });

  yup.addMethod(yup.string, 'validDateTime', function () {
    return this.test((value, { createError, path }) => {
      if (value === null || value === undefined || value === '') {
        return true;
      }

      return (
        dayjs(value, ACCEPTED_DATETIME_FORMAT, true).isValid() ||
        createError({ path, message: messages.typeError('${label}', '日時') })
      );
    });
  });

  yup.addMethod(yup.string, 'valueOf', function (input: object) {
    return this.test((value, { createError, path }) => {
      let obj = input;
      if ((<any>input).value !== undefined) {
        obj = (<any>input).value;
      }
      const keyArr = Object.keys(obj);
      if (isEmpty(keyArr)) return true;
      if (obj === null)
        return createError({
          path,
          message: 'データを読み込み中です',
        });

      const valueList = Object.values(obj).map(String);
      if (!value) {
        return true;
      } else {
        const dataList = String(value).split(',');
        for (const data of dataList) {
          if (!valueList.includes(data)) {
            return createError({
              path,
              message: messages.effectivenessError('${label}'),
            });
          }
        }

        return true;
      }
    });
  });

  yup.addMethod(yup.number, 'valueOf', function (input: object) {
    return this.test((value, { createError, path }) => {
      let obj = input;
      if ((<any>input).value !== undefined) {
        obj = (<any>input).value;
      }
      const keyArr = Object.keys(obj);
      if (isEmpty(keyArr)) return true;
      if (obj === null)
        return createError({
          path,
          message: 'データを読み込み中です',
        });

      const valueList = keyArr.filter((val) => /^-?\d+$/.test(val));

      if (value == null || value === undefined) {
        return true;
      } else {
        const dataList = String(value).split(',');
        for (const data of dataList) {
          if (!valueList.includes(data)) {
            return createError({
              path,
              message: messages.effectivenessError('${label}'),
            });
          }
        }

        return true;
      }
    });
  });

  yup.addMethod(yup.array, 'valueOf', function (input: object) {
    return this.test((value, { createError, path }) => {
      let obj = input;
      if ((<any>input).value !== undefined) {
        obj = (<any>input).value;
      }
      const keyArr = Object.keys(obj);
      if (isEmpty(keyArr)) return true;
      if (obj === null)
        return createError({
          path,
          message: 'データを読み込み中です',
        });

      const valueList = keyArr.filter((val) => /^-?\d+$/.test(val));

      if (!value) {
        return true;
      } else {
        for (const data of value) {
          if (!valueList.includes(String(data))) {
            return createError({
              path,
              message: messages.effectivenessError('${label}'),
            });
          }
        }

        return true;
      }
    });
  });

  yup.addMethod(
    yup.string,
    'requiredIf',
    function (cond: () => boolean | Promise<boolean>) {
      // Caution: Using this.nullable() to handle potential null values here.
      // This is necessary to prevent the possibility of throwing the error "${label} cannot be null" when using yup.test(...)
      const thisNullable = this.nullable() as yup.StringSchema<
        string | undefined,
        yup.Maybe<yup.AnyObject>,
        undefined,
        ''
      >;

      return thisNullable.test(async (value, { createError, path }) => {
        if ((await Promise.resolve(cond())) === false) return true;
        if (value === null || value === undefined || value === '')
          return createError({
            path,
            message: messages.createEssential('${label}'),
          });
        return true;
      });
    },
  );

  yup.addMethod(yup.array, 'requiredArray', function () {
    return this.test((value, { createError, path }) => {
      if (value instanceof Array && value.length) return true;

      return createError({
        path,
        message: messages.createEssential('${label}'),
      });
    });
  });

  yup.addMethod(yup.string, 'isAfterOrEqualTo', function (refField, message) {
    return this.test('is-after-or-equal-to', message, function (value) {
      const { path, createError, parent } = this;
      const refValue = parent[refField];

      if (!value || !refValue) return true;

      const isValid =
        dayjs(value).isAfter(dayjs(refValue)) ||
        dayjs(value).isSame(dayjs(refValue));

      return isValid || createError({ path, message });
    });
  });

  yup.addMethod(
    yup.number,
    'isGreaterThanOrEqualTo',
    function (refField, message) {
      return this.test(
        'is-greater-than-or-equal-to',
        message,
        function (value) {
          const { path, createError, parent } = this;
          const refValue = parent[refField];

          if (value == null || refValue == null) return true;

          const isValid = value >= refValue;

          return isValid || createError({ path, message });
        },
      );
    },
  );
};

setupCustomValidator();

declare module 'yup' {
  interface StringSchema {
    integer(): this;
    positiveInteger(): this;
    decimal(): this;
    positiveDecimal(): this;
    decimal101(): this;
    phonenumber(): this;
    hiragana(): this;
    alphanumeric(): this;
    halfWidthKatakana(): this;
    password(): this;
    time(): this;
    valueOf(obj: object): this;
    requiredIf(cond: () => boolean | Promise<boolean>): this;
    validDate(): this;
    validDateTime(): this;
    isAfterOrEqualTo(refField: string, message: string): this;
    isGreaterThanOrEqualTo(refField: string, message: string): this;
  }

  interface NumberSchema {
    valueOf(obj: object): this;
    positiveInteger(): this;
    maxLength(max: number, customMessage?: string): this;
    isGreaterThanOrEqualTo(refField: string, message: string): this;
  }
}

export * from 'yup';

export const str = () =>
  yup
    .string()
    .transform((value) => (value === '' ? null : value))
    .typeError(messages.typeError('${label}', '文字'));

export const nat = () =>
  yup
    .number()
    .transform((value, org) => (org === '' ? null : value))
    .typeError(messages.typeError('${label}', '数値'))
    .test(
      'not-array',
      messages.typeError('${label}', '数値'),
      (_, context) => !Array.isArray(context.originalValue),
    )
    .positiveInteger();

export const num = () =>
  yup
    .number()
    .transform((value, org) => (org === '' ? null : value))
    .typeError(messages.typeError('${label}', '数値と"-"'));

export const flags = () =>
  yup
    .mixed<string[]>()
    .transform((value) =>
      value instanceof Array ? value : value ? value.split(',') : [],
    );

export type InferSearchType<T extends yup.ISchema<any, any, any, any>> = Omit<
  yup.InferType<T>,
  'limit' | 'offset'
> & {
  limit?: number;
  offset?: number;
};

export const jsonObj = () =>
  yup
    .mixed<object | string>()
    .test((value) => {
      if (typeof value !== 'object' && value != null) return false;
      if (Array.isArray(value)) return false;
      return true;
    })
    .transform((value) => {
      try {
        if (typeof value === 'object') {
          return value;
        } else {
          if (typeof value === 'string' && value == '') return null;
          else return JSON.parse(value);
        }
      } catch (_err) {
        return value;
      }
    })
    .typeError(messages.typeError('${label}', 'JSON'));
