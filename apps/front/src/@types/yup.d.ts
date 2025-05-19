import { Ref } from 'vue';
import * as yup from 'yup';
import { AnyObject, Maybe } from 'yup/lib/types';

declare module 'yup' {
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType,
  > extends yup.BaseSchema<TType, TContext, TOut> {
    hiragana(): StringSchema<TType, TContext>;
    isIn(
      e: Record<string, unknown>,
      options?: { valueIsString?: boolean },
    ): StringSchema<TType, TContext>;
    katakana(): StringSchema<TType, TContext>;
    password(): StringSchema<TType, TContext>;
    valueOf(obj: object): StringSchema<TType, TContext>;
    emailAddress(): StringSchema<TType, TContext>;
    sameAs(
      fieldValue: Ref<any>,
      message?: string,
    ): StringSchema<TType, TContext>;
    compareDateFromAndTo(
      fieldValue: Ref<any>,
      message?: string,
    ): StringSchema<TType, TContext>;
    compareDateToAndFrom(
      fieldValue: Ref<any>,
      message?: string,
    ): StringSchema<TType, TContext>;
    dateISO(): StringSchema<TType, TContext>;
  }
}
