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
    .required(messageApiError.requiredError('name'))
    .max(100, ({ value, label }) =>
      messageApiError.lengthExceeded(label, 100, value.length),
    )
    .label('name'),
  email: str()
    .required(messageApiError.requiredError('email'))
    .email(messageApiError.emailErorr())
    .max(255, ({ value, label }) =>
      messageApiError.lengthExceeded(label, 255, value.length),
    )
    .label('email'),
  position_id: num()
    .required(messageApiError.requiredError('position_id'))
    .test('should position id valid', messageApiError.valueError(), (value) => {
      return includes(values(Position), value);
    })
    .label('position_id'),
  started_date: str()
    .validDate()
    .required(messageApiError.requiredError('started_date'))
    .label('started_date'),
  password: str()
    .required(messageApiError.requiredError('password'))
    .max(255, ({ value, label }) =>
      messageApiError.lengthExceeded(label, 255, value.length),
    )
    .label('password'),
});

export type createCustomerType = InferType<typeof createCustomerSchema>;
