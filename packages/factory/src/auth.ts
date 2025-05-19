import { InferType, object, str } from './_yup';
import { IUserMainAttr } from './user';

export interface IUserInfo extends Omit<IUserMainAttr, 'password'> {
  id: number;
  name: string;
}

export const loginSchema = object({
  email: str().required().label('email'),
  password: str().required().label('password'),
});

export type ILoginParams = InferType<typeof loginSchema>;
