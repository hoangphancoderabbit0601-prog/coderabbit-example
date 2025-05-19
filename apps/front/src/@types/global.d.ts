import AuthInputGroup from '@/atoms/AuthInputGroup.vue';
import Btn from '@/atoms/Btn.vue';
import Card from '@/atoms/Card.vue';
import DatePicker from '@/atoms/DatePicker.vue';
import ErrorMessage from '@/atoms/ErrorMessage.vue';
import InputGroup from '@/atoms/InputGroup.vue';
import PageTitle from '@/atoms/PageTitle.vue';
import Select from '@/atoms/Select.vue';
import Pagination from '@/components/Pagination.vue';

declare global {
  var InputGroup: typeof InputGroup;
  var DatePicker: typeof DatePicker;
  var PageTitle: typeof PageTitle;
  var Card: typeof Card;
  var ErrorMessage: typeof ErrorMessage;
  var Pagination: typeof Pagination;
  var Btn: typeof Btn;
  var Dropdown: typeof Select;
  var AuthInputGroup: typeof AuthInputGroup;
}

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    InputGroup: typeof InputGroup;
    DatePicker: typeof DatePicker;
    PageTitle: typeof PageTitle;
    Card: typeof Card;
    ErrorMessage: typeof ErrorMessage;
    Pagination: typeof Pagination;
    Btn: typeof Btn;
    Dropdown: typeof Select;
    AuthInputGroup: typeof AuthInputGroup;
  }
}
