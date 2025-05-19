export const nl2br = (str: string, isXhtml = false) => {
  if (str === undefined || str === null) {
    return '';
  }
  const breakTag = isXhtml ? '<br />' : '<br>';
  return str.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, `$1${breakTag}$2`);
};
