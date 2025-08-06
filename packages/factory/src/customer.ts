import { includes, values } from 'lodash';

import { messageApiError } from './_constant';
import { InferType, num, object, str } from './_yup';
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

export type createCustomerType = InferType<typeof createCustomerSchema>;
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
export type updateCustomerType = InferType<typeof updateCustomerSchema>;
