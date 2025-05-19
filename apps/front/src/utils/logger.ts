import debug from 'debug';

debug.enable(
  import.meta.env.DEV ? <string>import.meta.env.VITE_DEBUG || 'intern-vue' : '',
);

export const logInfo = debug('intern-vue:info:');

const errorLogger = debug('intern-vue:error:');
export const logError = (obj: any) => {
  errorLogger(obj);
  if (obj instanceof Error) {
    errorLogger(JSON.parse(JSON.stringify(obj)));
  }
};
