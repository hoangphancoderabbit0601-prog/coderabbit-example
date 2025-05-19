import clone from 'lodash/clone';
import entries from 'lodash/entries';
import filter from 'lodash/filter';
import isEqualWith from 'lodash/isEqualWith';
import keys from 'lodash/keys';
import values from 'lodash/values';

export const enum2ObjectV2 = (e: any) => {
  const result: { [key: string]: string } = {};
  const keyArr = keys(e).sort();
  const valueArr = values(e).sort();

  if (isEqualWith(keyArr, valueArr, (a, b) => `${a}` === `${b}`)) {
    const numberOnlyKeys = filter(keyArr, (val) => {
      return isNaN(Number(val)) === false;
    });
    for (const key of numberOnlyKeys) {
      result[key] = e[key];
    }

    return result;
  } else {
    // not enum
    return e;
  }
};

export const enum2OptionsSelect = (
  e: { [key: string]: string },
  blankValue = false,
) => {
  const result = [];
  if (blankValue) {
    result.push({
      code: '',
      label: '-----',
    });
  }
  const object = enumObject(e);

  Object.keys(object).forEach((key) => {
    result.push({
      code: isNaN(Number(key)) ? key : Number(key),
      label: object[key],
    });
  });

  return result;
};

export const enum2Object = (
  e: any,
  blankValue = false,
  sortNumber = false,
  customSort: any = null,
) => {
  const result = new Map();
  if (blankValue) {
    result.set('', '-');
  }

  const keyArr = keys(e).sort();
  const valueArr = values(e).sort();

  if (isEqualWith(keyArr, valueArr, (a, b) => `${a}` === `${b}`)) {
    let numberOnlyKeys = filter(keyArr, (val) => {
      return isNaN(Number(val)) === false;
    });
    if (sortNumber) {
      numberOnlyKeys = numberOnlyKeys.sort((a, b) =>
        Number(a) > Number(b) ? 1 : Number(b) > Number(a) ? -1 : 0,
      );
    }
    if (customSort && customSort.length === numberOnlyKeys.length) {
      numberOnlyKeys = customSort.map((doc: string | number) => doc);
    }
    for (const key of numberOnlyKeys) {
      result.set([key], e[key]);
    }

    return result;
  } else {
    // not enum
    return entries(e);
  }
};

export const enum2SelectOptions = (
  e: Record<string | number, string | number>,
  options?: {
    blankValue?: boolean;
    keyIsString?: boolean;
    valueIsString?: boolean;
  },
): Array<{
  value: string | number;
  text: string;
}> => {
  const {
    blankValue = false,
    keyIsString = false,
    valueIsString = false,
  } = options ?? {};

  const result = [];
  if (blankValue) {
    result.push({
      value: '',
      text: '---',
    });
  }
  const object = enumObject(e, { valueIsString });

  Object.keys(object).forEach((key) => {
    result.push({
      value: (isNaN(Number(key)) || keyIsString ? key : Number(key)).toString(),
      text: object[key],
    });
  });

  return result;
};

export const customSort = (
  optionsSelect: { code: string; label: string }[],
  sortPosition: Array<number | string>,
) => {
  if (sortPosition.length === optionsSelect.length) {
    const result = [];
    for (const index of sortPosition) {
      for (const item of optionsSelect) {
        if (item.code == String(index)) {
          result.push(item);
        }
      }
    }
    return result;
  } else {
    return optionsSelect;
  }
};

export const enumObject = (
  e: Record<string | number, string | number>,
  option?: { valueIsString: boolean },
) => {
  const { valueIsString = false } = option ?? {};
  const result: Record<string | number, string | number> = {};

  Object.keys(e)
    .filter((val) => {
      return valueIsString ? true : isNaN(Number(val)) === false;
    })
    .forEach((key) => {
      result[key] = e[key];
    });

  return result;
};

export const sleep = (delay: number, promise: () => Promise<any>) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(async () => {
      try {
        await promise();
      } catch (err) {
        reject(err);
      }
      resolve();
    }, delay);
  });
};

export const setZeroValue = (valueStatic: {
  [key: string]: string | number;
}) => {
  valueStatic = clone(valueStatic);
  valueStatic[0] = '---';
  valueStatic['---'] = 0;
  delete valueStatic['-'];
  return valueStatic;
};

export type Awaited<T extends (...args: any[]) => Promise<any>> =
  ReturnType<T> extends PromiseLike<infer U> ? U : T;

export type FormData<T> = {
  [P in keyof T]: T[P] extends Array<any> ? T[P] : T[P] | string;
};

export const getDeepValues = (obj: object) => {
  const valuesArr: string[] = [];
  const valuesObj = values(obj);

  for (const value of valuesObj) {
    if (typeof value === 'object') {
      const subValues = getDeepValues(value);
      valuesArr.push(...subValues);
    } else {
      valuesArr.push(value);
    }
  }
  return valuesArr;
};
