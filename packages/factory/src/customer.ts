import dayjs from 'dayjs';
import { includes, values } from 'lodash';

import { messageApiError, messageFrontError } from './_constant';
import { boolean, flags, InferType, num, number, object, str } from './_yup';
export enum Position {
  Administrator = 0,
  Group = 1,
  User = 2,
}

export const createCustomerSchema = object({
  name: str()
    .required(messageApiError.requiredError('顧客名'))
    .max(100, ({ value, label }) =>
      messageApiError.lengthExceeded(label, 100, value.length),
    )
    .label('顧客名'),
  email: str()
    .required(messageApiError.requiredError('メールアドレス'))
    .email(messageApiError.emailErorr())
    .max(255, ({ value, label }) =>
      messageApiError.lengthExceeded(label, 255, value.length),
    )
    .label('メールアドレス'),
  position_id: num()
    .required(messageApiError.requiredError('役職'))
    .test('should position id valid', messageApiError.valueError(), (value) => {
      return includes(values(Position), value);
    })
    .label('役職'),
  started_date: str()
    .validDate()
    .required(messageApiError.requiredError('会員登録日'))
    .label('会員登録日'),
  password: str()
    .required(messageApiError.requiredError('パスワード'))
    .max(255, ({ value, label }) =>
      messageApiError.lengthExceeded(label, 255, value.length),
    )
    .label('パスワード'),
});

export type CreateCustomerType = InferType<typeof createCustomerSchema>;
export const updateCustomerSchema = createCustomerSchema.concat(
  object({
    password: str()
      .optional()
      .transform((v) => (v === null ? '' : v))
      .min(1, messageApiError.requiredError('パスワード'))
      .max(255, ({ value, label }) =>
        messageApiError.lengthExceeded(label, 255, value.length),
      )
      .label('パスワード'),
  }),
);
export type UpdateCustomerType = InferType<typeof updateCustomerSchema>;

export const searchCustomerSchema = object({
  name: str()
    .optional()
    .nullable()
    .max(100, ({ value, label }) =>
      messageApiError.lengthExceeded(label, 100, value.length),
    )
    .label('顧客名'),
  position_id: flags().optional().label('役職'),
  started_date_from: str()
    .validDate()
    .optional()
    .test(
      'should before started_date_to',
      messageFrontError.ECL041(),
      function (value) {
        const { started_date_to } = this.parent;
        if (!started_date_to || !value) return true;
        return !dayjs(value).isAfter(dayjs(started_date_to));
      },
    )
    .label('会員登録日From'),
  started_date_to: str().validDate().optional().label('会員登録日To'),
  limit: number()
    .typeError(messageApiError.datatypeError('取得件数', 'number'))
    .optional()
    .min(1, messageApiError.valueError())
    .max(10, messageApiError.valueError())
    .label('取得件数'),
  offset: number()
    .typeError(messageApiError.datatypeError('page数', 'number'))
    .optional()
    .min(1, messageApiError.valueError())
    .label('page数'),
});

export type SearchCustomerType = InferType<typeof searchCustomerSchema>;

export type SearchCustomerResponseType = {
  id: string;
  email: string;
  name: string;
  started_date: string;
  position_id: string;
  orders: [
    {
      id: string;
      item_name: string;
      created_date: string;
    },
  ];
  created_date: string;
  updated_date: string;
};

export type SearchCustomerResponseFormatType = {
  customer: SearchCustomerResponseType[];
  total_count: number;
};

export const upsertCustomerFrontSchema = createCustomerSchema.concat(
  object({
    isEdit: boolean().default(false),
    position_id: num()
      .required(messageApiError.requiredError('役職'))
      .test(
        'should position id valid',
        messageApiError.valueError(),
        (value) => {
          if (value === -1) return true;
          return includes(values(Position), value);
        },
      )
      .label('役職'),
    password: str()
      .transform((v) => (v === null ? '' : v))
      .test('should validate password', function (value) {
        const { isEdit } = this.parent;

        // If isEdit = false (create mode), password is required and must be 8-20 characters
        if (!isEdit) {
          if (!value) {
            return this.createError({
              message: messageApiError.requiredError('パスワード'),
            });
          }
          if (!/^.{8,20}$/.test(value)) {
            return this.createError({
              message: messageFrontError.ECL021(),
            });
          }
        }

        // If isEdit = true (edit mode), password is optional but if provided must be 8-20 characters
        if (isEdit && value && !/^.{8,20}$/.test(value)) {
          return this.createError({
            message: messageFrontError.ECL021(),
          });
        }

        return true;
      })
      .label('パスワード'),
    rePassword: str()
      .transform((v) => (v === null ? '' : v))
      .test('should validate rePassword', function (value) {
        const { isEdit, password } = this.parent;

        // If isEdit = true and password is provided, check if rePassword matches
        if (isEdit && password && value !== password) {
          return this.createError({
            message: messageFrontError.ECL027(),
          });
        }

        // If isEdit = false (create mode), rePassword must match password
        if (!isEdit && value !== password) {
          return this.createError({
            message: messageFrontError.ECL027(),
          });
        }
        return true;
      })
      .label('パスワード確認'),
  }),
);
export type UpsertCustomerFrontType = InferType<
  typeof upsertCustomerFrontSchema
>;
