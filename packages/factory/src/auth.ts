import { messageApiError } from './_constant';
import { InferType, object, str } from './_yup';
import { IUserMainAttr } from './user';

export interface IUserInfo extends Omit<IUserMainAttr, 'password'> {
  id: number;
  name: string;
}

export const loginSchema = object({
  email: str().required(messageApiError.requiredError('email')).label('email'),
  password: str()
    .required(messageApiError.requiredError('password'))
    .label('password'),
});

export type ILoginParams = InferType<typeof loginSchema>;
