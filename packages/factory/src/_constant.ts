export const messages = {
  required: (column: string) => `${column} is required`,
  emailAddressFormatError: (column: string) =>
    `"${column}" is in an invalid email format.`,
  nonKatakanaInputError: (column: string) =>
    `Please enter "${column}" in katakana.`,
  inputMismatchError: (...args: string[]) =>
    `"${args[0]}" and "${args[1]}" do not match.`,
  createEssential: (column: string) => `${column} is required`,
  lengthExceeded: (column: string, length: string | number) =>
    `Please enter ${column} within ${length} characters`,
  typeError: (column: string, type: string) =>
    `${column} can only be entered as ${type}`,
  passwordError:
    'Password must be at least 8 characters long and contain a combination of letters and numbers',
  systemError: 'System error, please contact the administrator',
  effectivenessError: (column: string) => `Please enter a valid ${column}`,
  saveSuccess: 'Saved successfully',
  decimalError: (
    column: string,
    length1: string | number,
    length2: string | number,
  ) =>
    `${column} must be a number with a maximum of ${length1} digits before the decimal point and ${length2} digits after the decimal point`,

  // error
  'E-CL-VAL-001': (label: string) => `${label} is a required field.`,
  'E-CL-VAL-002': (
    column: string,
    length: string | number,
    curLength: string | number,
  ) =>
    `Please enter ${column} within "${length}" characters. (Current: ${curLength} characters)`,
  'E-CL-VAL-003': (label: string, maxLength: number, curLength: number) =>
    `Please enter ${label} with at least "${maxLength}" characters. (Current: ${curLength} characters)`,
  'E-CL-CON-017': (column1: string, column2: string) =>
    `${column1} must be greater than ${column2}.`,
  valueExceeded: (column: string, value: string | number) =>
    `Please enter ${column} less than or equal to ${value}.`,
  'E-SV-BIZ-001': 'No data found matching the search criteria.',
  'E-SV-BIZ-002': (column: string) => `The specified ${column} already exists.`,
  'E-SV-SYS-003':
    'Failed to save data. Please contact the system administrator.',
  'E-CL-SYS-003':
    'Failed to communicate with API. Please contact the system administrator.',

  // info
  'I-CL-INF-002': (column: string) => `${column} has been saved.`,
  deleteSearchCondition: `search condition deleted`,
  recentlyViewedCarAdded: `recently viewed car added`,
  noRecentlyViewedCars: 'No recently viewed cars',
};

export const Symbols = {
  TIMEOUT: 'TIMEOUT',
  CANCELLED: 'CANCELLED',
};

export const StatusMessage = {
  SUCCESS: 'success',
};

export const paletteSymbols = {
  inspectionSymbol: {
    groupName: '検査記号',
    symbols: [
      {
        code: 'inspection-a1',
        name: 'A1',
        desc: 'DESCRIPTION',
        bgColor: '#ff1600',
      },
      {
        code: 'inspection-a2',
        name: 'A2',
        desc: 'DESCRIPTION',
        bgColor: '#ff1600',
      },
      {
        code: 'inspection-a3',
        name: 'A3',
        desc: 'DESCRIPTION',
        bgColor: '#ff1600',
      },
      {
        code: 'inspection-b1',
        name: 'B1',
        desc: 'DESCRIPTION',
        bgColor: '#ff00ff',
      },
      {
        code: 'inspection-b2',
        name: 'B2',
        desc: 'DESCRIPTION',
        bgColor: '#ff00ff',
      },
      {
        code: 'inspection-b3',
        name: 'B3',
        desc: 'DESCRIPTION',
        bgColor: '#ff00ff',
      },
      {
        code: 'inspection-u1',
        name: 'U1',
        desc: 'DESCRIPTION',
        bgColor: '#ff8200',
      },
      {
        code: 'inspection-u2',
        name: 'U2',
        desc: 'DESCRIPTION',
        bgColor: '#ff8200',
      },
      {
        code: 'inspection-u3',
        name: 'U3',
        desc: 'DESCRIPTION',
        bgColor: '#ff8200',
      },
      {
        code: 'inspection-s1',
        name: 'S1',
        desc: 'DESCRIPTION',
        bgColor: '#ffec00',
      },
      {
        code: 'inspection-s2',
        name: 'S2',
        desc: 'DESCRIPTION',
        bgColor: '#ffec00',
      },
      {
        code: 'inspection-s3',
        name: 'S3',
        desc: 'DESCRIPTION',
        bgColor: '#ffec00',
      },
      {
        code: 'inspection-w1',
        name: 'W1',
        desc: 'DESCRIPTION',
        bgColor: '#3a9700',
      },
      {
        code: 'inspection-w2',
        name: 'W2',
        desc: 'DESCRIPTION',
        bgColor: '#3a9700',
      },
      {
        code: 'inspection-w3',
        name: 'W3',
        desc: 'DESCRIPTION',
        bgColor: '#3a9700',
      },
      {
        code: 'inspection-x',
        name: 'X',
        desc: 'DESCRIPTION',
        bgColor: '#009ef2',
      },
      {
        code: 'inspection-xx',
        name: 'XX',
        desc: 'DESCRIPTION',
        bgColor: '#009ef2',
      },
      {
        code: 'inspection-crack',
        name: 'ワレ',
        desc: 'DESCRIPTION',
        bgColor: '#0018d1',
      },
      {
        code: 'inspection-color-fading',
        name: '色アセ',
        desc: 'DESCRIPTION',
        bgColor: '#0018d1',
      },
      {
        code: 'inspection-p-mark',
        name: 'Pアト',
        desc: 'DESCRIPTION',
        bgColor: '#0018d1',
      },
      {
        code: 'inspection-c',
        name: 'C',
        desc: 'DESCRIPTION',
        bgColor: '#0018d1',
      },
    ],
  },
  forGlass: {
    groupName: 'ガラス用',
    symbols: [
      {
        code: 'for-glass-repair-mark',
        name: 'リペア跡',
        desc: 'DESCRIPTION',
        bgColor: '#dc33ff',
      },
      {
        code: 'for-glass-stone-chip',
        name: 'トビ石',
        desc: 'DESCRIPTION',
        bgColor: '#dc33ff',
      },
      {
        code: 'for-glass-crack',
        name: 'ヒビ',
        desc: 'DESCRIPTION',
        bgColor: '#dc33ff',
      },
      {
        code: 'for-glass-break',
        name: 'ワレ',
        desc: 'DESCRIPTION',
        bgColor: '#0018d1',
      },
      {
        code: 'for-glass-X-require',
        name: 'X要す',
        desc: 'DESCRIPTION',
        bgColor: '#dc33ff',
      },
    ],
  },
};

export const messageApiError = {
  requiredError: (nameCategory: string) => `${nameCategory}は必須です。`,
  lengthExceeded: (
    nameCategory: string,
    maxLength: number,
    currentLength: number,
  ) =>
    `${nameCategory}は「${maxLength}」文字以下で入力してください。（現在${currentLength}文字）`,
  emailErorr: () => 'メールアドレスを正しく入力してください。',
  loginFailure: () => 'メールアドレスまたは会員IDが間違っています。',
  datatypeError: (nameCategory: string, dataType: string) =>
    `${nameCategory}は${dataType}で入力してください。`,
  valueError: () => '有効なリスト値を入力してください。',
  notExistError: (nameCategory: string) =>
    `該当する${nameCategory}がありません。`,
  duplicateValueError: () => 'すでにメールアドレスは登録されています。',
  deleteError: () => 'ログインしているアカウントを削除できません。',
  formatError: (nameCategory: string) =>
    `${nameCategory}は日付を正しく入力してください。`,
};

export const messageFrontError = {
  ECL001: (categoryName: string) => `${categoryName}は必須です。`,
  ECL002: (categoryName: string, maxLength: number, current: number) =>
    `${categoryName}は「${maxLength}」文字以下で入力してください。（現在${current}文字）`,
  ECL003: (categoryName: string, minLength: number, current: number) =>
    `${categoryName}は「${minLength}」文字以上で入力してください。（現在${current}文字）`,
  ECL004: (categoryName: string) =>
    `${categoryName}は半角英数で入力してください。`,
  ECL005: () => 'メールアドレスを正しく入力してください。',
  ECL006: (categoryName: string) => `${categoryName}は全角で入力してください。`,
  ECL007: (categoryName: string) =>
    `${categoryName}は全角カナで入力してください。`,
  ECL008: (categoryName: string) =>
    `${categoryName}は日付を正しく入力してください。`,
  ECL009: (categoryName: string) =>
    `${categoryName}は郵便番号を正しく入力してください。`,
  ECL010: (categoryName: string) =>
    `${categoryName}は数字を正しく入力してください。`,
  ECL011: (categoryName: string) =>
    `${categoryName}は電話番号を正しく入力してください。`,
  ICL012: () => '検索結果は0件です。',
  ICL013: (field: string) => `${field}します。よろしいですか？`,
  ECL014: () => `再度、新規アカウント作成を行ってください。`,
  ECL015: () => '再度、パスワード再設定を行ってください。',
  ECL016: () => 'メールアドレスまたは会員IDが間違っています。',
  ECL017: () =>
    '入力した情報のいずれかの情報が間違っています。\n確認してから再度試してください。',
  ECL018: () => '確認用のメールアドレスが間違っています。',
  ECL019: () => 'すでにメールアドレスは登録されています。',
  ECL020: () => '入力した文字が間違っています。',
  ECL021: () => 'パスワードは半角英数字記号で8～20文字で入力してください。',
  ECL022: () => 'パスワードには会員IDと同じ値は使用できません。',
  ECL023: () =>
    'パスワードには半角数字のみ、または半角英字のみの値は使用できません。',
  ECL024: () => '現在のパスワードは正しくありません。',
  ECL025: () => 'すでに会員IDは登録されています。',
  ECL026: () => 'すでに会員登録されています。',
  ECL027: () => '確認用のパスワードが間違っています。',
  ECL028: (categoryName: string, require: number, current: number) =>
    `${categoryName}は「${require}」文字で入力してください。（現在${current}文字）`,
  ECL029: (categoryName: string) =>
    `${categoryName}は最低1文字数字以外の文字を含む必要があります。`,
  ECL030: (
    formatFile: string, // Ex: CSVファイル
  ) => `ファイル形式が誤っています。${formatFile}を選択してください。`,
  ECL031: (size: string) => `ファイルのサイズ制限${size}を超えています。`,
  ECL032: () => 'ファイルの生成に失敗しました。',
  ECL033: (data: string) => `${data}が取得できませんでした。`,
  ICL034: (quantity: string) => `CSV出力件数は${quantity}件です。`,
  ECL035: (category: string, byteNumber: number, current: number) =>
    `${category}は「${byteNumber}」バイト以下で入力してください。（現在${current}バイト）`,
  ICL036: (category: string) => `${category}は半角数字で入力してください。`,
  ICL037: (category: string) => `${category}は半角英字で入力してください。`,
  ECL038: () => 'アップロードするファイル中身が正しくありません。',
  ECL039: () => 'アクセス権限がありません。',
  ECL040: () => 'ログインしているアカウントを削除できません。',
  ECL041: () => '指定された期間は正しくありません。',
  ICL042: () => 'インポートできました。',
  ECL043: () => '登録・更新・削除処理に失敗しました。',
  ECL044: (categoryName: string) => `${categoryName}が存在しておりません。`,
  ECL045: () => 'CSV取込に失敗しました。',
  ICL046: () => '登録・更新・削除処理に成功しました。',
  ECL047: () => 'CSV出力に失敗しました。',
  ECL048: () => 'システムエラーになります。',
  ICL049: () => '登録された顧客が0件です。',
  ICL050: () => '現在注文がありません。',
};
