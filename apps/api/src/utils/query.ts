import dayjs from 'dayjs';
import { isUndefined } from 'lodash';
import { Op, WhereAttributeHash, WhereOptions } from 'sequelize';

export const makeAmbiguousWhere = <T extends object>(
  params: T,
  field: keyof T,
  searchField?: string,
): WhereAttributeHash => {
  if (searchField === undefined) {
    return {
      [field]: { [Op.like]: `%${params[field]}%` },
    };
  } else {
    return {
      [searchField]: { [Op.like]: `%${params[field]}%` },
    };
  }
};

/**
 * array of valid datetime format
 */
export const dateTimeDefined = [
  'YYYY-MM-DD',
  'YYYY-M-D',
  'YYYY/MM/DD',
  'YYYY/M/D',
  'YYYY-MM-DD HH:mm:ss',
  'YYYY-M-D HH:mm:ss',
  'YYYY-MM-DD H:m:s',
  'YYYY-M-D H:m:s',
  'YYYY/MM/DD HH:mm:ss',
  'YYYY/M/D HH:mm:ss',
  'YYYY/MM/DD H:m:s',
  'YYYY/M/D H:m:s',
];

/**
 * search date From To
 */
export const searchDateFromTo = (date: {
  from?: Date | string | undefined;
  to?: Date | string | undefined;
}) => {
  let whereDate: any = {};

  if (!isUndefined(date.from) && date.from !== '') {
    const dateFrom = dayjs(date.from, dateTimeDefined, true);
    whereDate = {
      ...whereDate,
      [Op.gte]: dateFrom.isValid()
        ? `${dayjs(date.from).format('YYYY-MM-DD')}`
        : null,
    };
  }
  if (!isUndefined(date.to) && date.to !== '') {
    const dateTo = dayjs(date.to, dateTimeDefined, true);
    whereDate = {
      ...whereDate,
      [Op.lte]: dateTo.isValid()
        ? `${dayjs(date.to).format('YYYY-MM-DD')}`
        : null,
    };
  }

  return whereDate as WhereOptions;
};
