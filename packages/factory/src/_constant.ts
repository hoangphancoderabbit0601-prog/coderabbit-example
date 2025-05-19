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
