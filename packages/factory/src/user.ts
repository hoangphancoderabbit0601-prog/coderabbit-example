import { InferType, object } from 'yup';

import { FormData, ICommonAttr, ICommonSearchOption } from './_common';
import { str } from './_yup';

export enum Position {
  Director = 0,
  Group = 1,
  Leader = 2,
  Member = 3,
}

export interface IUserMainAttr {
  email: string;
  password: string;
  name: string;
  startedDate: string;
  positionId: number;
}

export interface IUserAttr extends IUserMainAttr, ICommonAttr {}

export interface IUserSearchParams extends ICommonSearchOption {
  name: string;
  dateFrom: string;
  dateTo: string;
}

export declare type UserForm = FormData<IUserMainAttr>;

export type User = Omit<IUserAttr, 'password' | 'groupId'> & {
  group: { id: number; name: string };
};

export const userSearchSchema = object({
  username: str().notRequired().max(100).label('User Name'),
  dateFrom: str().notRequired().label('Started Date From'),
  dateTo: str().notRequired().label('Started Date To'),
});

export type UserSearchParams = InferType<typeof userSearchSchema>;

export const userCreateSchema = object({
  email: str().required().label('Email'),
  name: str().required().label('User Name'),
  startedDate: str().required().label('Started Date'),
  groupId: str().required().label('Group'),
  password: str().required().label('Password'),
  positionId: str().required().label('Position'),
  passwordConfirmation: str().required().label('Password Confirmation'),
});

export type IUserCreateParams = InferType<typeof userCreateSchema>;
