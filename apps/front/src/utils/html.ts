import Big from 'big.js';
import isNil from 'lodash/isNil';

export const convertRemToPixels = (rem: number) => {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
};

const addCommaToNumber = (value: number | string) => {
  if (isNil(value)) {
    return value;
  }
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const number = (
  value?: Big | number | string,
  isCurrency = false,
  editable = false,
) => {
  if (editable) return String(value);
  if (value === null || value === undefined) {
    return '';
  }
  const prefix = isCurrency ? '￥ ' : '';
  let temp = '';
  if (value instanceof Big) {
    temp = addCommaToNumber(value.toFixed());
  } else {
    temp = addCommaToNumber(value);
  }
  return temp.length > 0 ? `${prefix}${temp}` : '';
};

export const getList = <
  T extends { [key in string | number]: string | number },
>(
  valueStatic: T,
  types?: string,
) => {
  const typeAsString = types?.split(',').map((type) => {
    if (valueStatic[type]) {
      return valueStatic[type];
    }
  });
  return typeAsString?.join(', ');
};

export const stringFlag = (
  valueStatic: { [key in string | number]: string | number },
  flag?: number | string,
) => {
  let value = '';
  if (flag !== undefined && flag !== null) {
    value = (valueStatic[flag] as string) || '';
  }

  return value;
};
