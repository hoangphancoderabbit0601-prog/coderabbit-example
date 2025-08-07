import { includes, values } from 'lodash';

import { messageApiError } from './_constant';
import { flags, InferType, num, number, object, str } from './_yup';
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
  started_date_from: str().validDate().optional().label('会員登録日From'),
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
    .min(0, messageApiError.valueError())
    .label('page数'),
});

export type SearchCustomerType = InferType<typeof searchCustomerSchema>;
