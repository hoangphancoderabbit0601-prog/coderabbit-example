import Swal from 'sweetalert2';

import { nl2br } from '@/utils/text';

const commonOption = {
  allowOutsideClick: false,
  allowEnterKey: false,
  allowEscapeKey: false,
  cancelButtonText: 'キャンセル',
  buttonsStyling: false,
  showClass: {
    popup: 'animate__fadeIn',
  },
  hideClass: {
    popup: 'animate__fadeOut',
  },
  customClass: {
    container:
      'position-fixed text-center bg-gray-600 bg-opacity-60 top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center p-0 w-full',
    popup:
      'text-center mb-4 text-gray-800 d-flex flex-column rounded-lg bg-white shadow-lg w-96 p-4 mb-10 focus-outline-none',
    title: 'mb-4 d-flex justify-content-center align-items-center',
    icon: 'my-4 mx-auto text-xl text-blue-400 rounded-circle border-4 border-blue-400 d-inline-flex justify-content-center align-items-center w-24 h-24',
    actions: 'd-flex w-100 justify-content-evenly space-x-2',
    htmlContainer: 'm-0 mb-4 text-base',
    confirmButton:
      'btn rounded-lg px-4 py-1.5 transition-opacity bg-primary cursor-pointer',
    cancelButton:
      'btn rounded-lg px-4 py-1.5 transition-opacity bg-warning cursor-pointer',
    input: 'mb-4',
    validationMessage:
      'd-flex justify-content-center align-items-center mt-4 p-2.5 overflow-hidden bg-gray-200 text-gray-500 text-sm',
  },
};

const alert = {
  confirm: (message: string, confirmButtonText = 'OK') => {
    return Swal.fire({
      ...commonOption,
      html: nl2br(message),
      icon: 'question',
      showCancelButton: true,
      confirmButtonText,
    });
  },
  success: (message: string) => {
    return Swal.fire({
      ...commonOption,
      html: nl2br(message),
      icon: 'success',
      iconHtml: '✔',
      showCancelButton: false,
    });
  },
  select: async (
    message: string,
    option: any,
    preConfirm: (value: string) => Promise<void>,
    inputValidator?: (value: string) => string,
  ) => {
    return Swal.fire({
      ...commonOption,
      inputOptions: option,
      input: 'select',
      preConfirm,
      showLoaderOnConfirm: true,
      html: nl2br(message),
      showCancelButton: true,
      inputValidator,
    });
  },
  info: (message: string) => {
    return Swal.fire({
      ...commonOption,
      html: nl2br(message),
      icon: 'info',
      showCancelButton: false,
    });
  },
  close: () => Swal.close(),
};

export type Alert = typeof alert;

export default () => {
  return alert;
};
