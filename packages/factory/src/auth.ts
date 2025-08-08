import { messageApiError } from './_constant';
import { InferType, object, str } from './_yup';
import { IUserMainAttr } from './user';

export interface IUserInfo extends Omit<IUserMainAttr, 'password'> {
  id: bigint;
}

export const loginSchema = object({
  email: str()
    .required(messageApiError.requiredError('メールアドレス'))
    .email(messageApiError.emailErorr())
    .max(255, ({ value, label }) =>
      messageApiError.lengthExceeded(label, 255, value.length),
    )
    .label('メールアドレス'),
  password: str()
    .required(messageApiError.requiredError('パスワード'))
    .max(255, ({ value, label }) =>
      messageApiError.lengthExceeded(label, 255, value.length),
    )
    .label('パスワード'),
});

export type ILoginParams = InferType<typeof loginSchema>;

export interface ILoginResponse {
  id: string;
  email: string;
  name: string;
  started_date: string;
  position_id: string;
  created_date: string;
  updated_date: string;
  token: {
    accessToken: string;
  };
}
