import { get, includes, isEmpty, keys, map, pickBy, set } from 'lodash';

export const pick = <T extends object>(
  params: T,
  field: (keyof T)[],
  childArrayOption?: { [i: string]: string[] },
) => {
  const result = <Required<T>>pick(params, field);

  if (childArrayOption !== undefined) {
    for (const childField of keys(childArrayOption)) {
      const childData = map(
        get(params, childField, []) as Array<any>,
        (child) => pick(child, childArrayOption[childField]),
      );
      set(result, childField, childData);
    }
  }

  return result;
};

/**
 * same as pick function but exclude undefined and empty string
 * @param params search parameter
 * @param fields field to pick
 */
export const pickForSearch = <T extends object>(
  params: T,
  fields: (keyof T)[],
) => {
  return <T>(
    pickBy(
      params,
      (value, key) =>
        includes(fields, <keyof T>key) &&
        (!isEmpty(value) || isFinite(value as number)),
    )
  );
};
