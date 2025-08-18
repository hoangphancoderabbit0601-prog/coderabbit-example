import { InferType, number, object, string } from 'yup';

import { messageApiError, messageFrontError } from './_constant';

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

export const orderCSVSchema = object({
  ID: string()
    .optional()
    .matches(/^\d*$/, ({ label }) => {
      return messageFrontError.ECL010(label);
    })
    .label('ID'),
  商品名: string()
    .required(({ label }) => {
      return messageFrontError.ECL001(label);
    })
    .max(15, ({ value, label }) => {
      return messageFrontError.ECL002(label, 15, value.length);
    })
    .label('商品名'),
  商品コード: string()
    .required(({ label }) => {
      return messageFrontError.ECL001(label);
    })
    .max(7, ({ value, label }) => {
      return messageFrontError.ECL002(label, 7, value.length);
    })
    .label('商品コード'),
  注文数量: string()
    .required(({ label }) => {
      return messageFrontError.ECL001(label);
    })
    .matches(/^\d+$/, ({ label }) => {
      return messageFrontError.ECL010(label);
    })
    .label('注文数量'),
  顧客ID: string()
    .required(({ label }) => {
      return messageFrontError.ECL001(label);
    })
    .label('顧客ID'),
  Delete: string()
    .optional()
    .matches(/^[Y]?$/, ({ label }) => {
      return `${label}はYまたは空白で入力してください。`;
    })
    .label('Delete'),
});

// Helper function to add row number to error messages
export const addRowNumberToError = (
  error: string,
  rowNumber: number,
): string => {
  return `${rowNumber}行目：${error}`;
};

export type SearchOrderType = InferType<typeof searchOrderSchema>;
export type OrderCSVType = InferType<typeof orderCSVSchema>;

export type SearchOrderResponseType = {
  id: string;
  item_name: string;
  item_code: string;
  item_quantity: string;
  created_date: string;
  updated_date: string;
  deleted_date: string;
  customer: {
    id: string;
    name: string;
  };
};

export type SearchOrderResponseFormatType = {
  order: SearchOrderResponseType[];
  total_count: number;
};

export type OrderCSVRow = {
  orderId?: string;
  name: string;
  quantity: string;
  customerId: string;
  isDelete: string;
};
