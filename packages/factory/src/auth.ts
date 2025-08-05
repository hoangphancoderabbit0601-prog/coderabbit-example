import { messageApiError } from './_constant';
import { InferType, object, str } from './_yup';
import { IUserMainAttr } from './user';

export interface IUserInfo extends Omit<IUserMainAttr, 'password'> {
  id: bigint;
  name: string;
}

export const loginSchema = object({
  email: str()
    .required(messageApiError.requiredError('email'))
    .email(messageApiError.emailErorr())
    .max(255, ({ value, label }) =>
      messageApiError.lengthExceeded(label, 255, value.length),
    )
    .label('email'),
  password: str()
    .required(messageApiError.requiredError('password'))
    .max(255, ({ value, label }) =>
      messageApiError.lengthExceeded(label, 255, value.length),
    )
    .label('password'),
});

export type ILoginParams = InferType<typeof loginSchema>;
