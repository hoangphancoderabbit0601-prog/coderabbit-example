import { InferType, number, object } from 'yup';

import { messageApiError } from './_constant';

export const searchOrderSchema = object({
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

export type SearchOrderType = InferType<typeof searchOrderSchema>;
