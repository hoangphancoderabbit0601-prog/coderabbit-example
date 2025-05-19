import dayjs from 'dayjs';
import isNil from 'lodash/isNil';

export const dateOnly2String = (
  string: string | Date | undefined,
  pattern = 'YYYY/MM/DD',
  timezone = 'Asia/Tokyo',
) => date2String(string, pattern, timezone);

export const date2String = (
  string: string | Date | undefined,
  pattern = 'YYYY/MM/DD HH:mm:ss',
  timezone = 'Asia/Tokyo',
) => {
  if (isNil(string) || string === '') {
    return string;
  }
  return dayjs(string).tz(timezone).format(pattern);
};
