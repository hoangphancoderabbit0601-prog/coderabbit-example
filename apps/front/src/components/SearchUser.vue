<script setup lang="ts">
import {
  Position,
  searchCustomerSchema,
  SearchCustomerType,
} from '@factory/customer';
import dayjs from 'dayjs';
import { values as valuesLodash } from 'lodash';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Checkbox from 'primevue/checkbox';
import CheckboxGroup from 'primevue/checkboxgroup';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { computed, onBeforeMount } from 'vue';

import { useFormWithSchema } from '@/composables/form';

/**props and emit */
const props = defineProps<{
  searchInput: SearchCustomerType;
  isReset: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:searchInput', val: SearchCustomerType): void;
  (e: 'update:isReset', val: boolean): void;
  (e: 'refresh-data'): void;
}>();

const { resetForm, validate, models, setData, values, errors } =
  useFormWithSchema(searchCustomerSchema, false);

onBeforeMount(() => {
  if (props.isReset) {
    resetForm();
    setData({
      ...props.searchInput,
      position_id: <string[]>(
        (<unknown>(
          valuesLodash(Position).filter((value) => typeof value === 'number')
        ))
      ),
    });
  }
});

// Computed properties to handle date conversion
const startDateComputed = computed({
  get: () => {
    const dateStr = models.started_date_from.value?.trim();
    return dateStr ? new Date(dateStr) : null;
  },
  set: (val: Date | null) => {
    models.started_date_from.value = val
      ? dayjs(val).format('YYYY/MM/DD')
      : undefined;
  },
});

const endDateComputed = computed({
  get: () => {
    const dateStr = models.started_date_to.value;
    return dateStr ? new Date(dateStr) : null;
  },
  set: (val: Date | null) => {
    models.started_date_to.value = val
      ? dayjs(val).format('YYYY/MM/DD')
      : undefined;
  },
});

const onFormSubmit = async () => {
  const isValid = (await validate()).valid;
  if (!isValid) {
    return validate();
  }

  emit('update:searchInput', {
    ...props.searchInput,
    offset: 1,
    name: values.name?.trim() || undefined,
    position_id: values.position_id,
    started_date_from: values.started_date_from || undefined,
    started_date_to: values.started_date_to || undefined,
  });
  emit('update:isReset', true);
  emit('refresh-data');
};

// Clear form
const clear = () => {
  resetForm();
};
const checkValidate = () => {
  validate();
};
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border">
    <h1 class="text-xl font-bold mb-4">検索条件</h1>

    <form
      @submit.prevent="onFormSubmit"
      @focusout="checkValidate()"
      class="space-y-6"
    >
      <!-- Customer Name -->
      <div class="form-row">
        <label
          class="w-20 text-sm font-medium text-gray-700 mr-4 flex items-center h-12"
          >顧客名</label
        >
        <div class="flex !w-full flex-col">
          <InputText
            v-model="models.name.value"
            class="flex-1 w-full h-12"
            style="max-width: 380px"
          />
          <div class="min-h-9 max-w-full min-w-full">
            <Message
              v-if="errors.name"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ errors.name }}
            </Message>
          </div>
        </div>
      </div>

      <!-- Position -->
      <div class="form-row">
        <label
          class="w-20 text-sm font-medium text-gray-700 mr-4 flex items-center h-12"
          >役職</label
        >
        <div class="flex !w-full flex-col">
          <CheckboxGroup v-model="models.position_id.value">
            <div class="flex flex-wrap gap-6 items-center h-12">
              <div class="flex items-center">
                <Checkbox inputId="admin" :value="Position.Administrator" />
                <label for="admin" class="ml-2 text-sm">管理者</label>
              </div>
              <div class="flex items-center">
                <Checkbox inputId="group" :value="Position.Group" />
                <label for="group" class="ml-2 text-sm">グループ管理者</label>
              </div>
              <div class="flex items-center">
                <Checkbox inputId="user" :value="Position.User" />
                <label for="user" class="ml-2 text-sm">一般ユーザ</label>
              </div>
            </div>
          </CheckboxGroup>
          <div class="min-h-9 max-w-full min-w-full">
            <!-- Empty error container for consistent spacing -->
          </div>
        </div>
      </div>

      <!-- Member Registration Date -->
      <div class="form-row">
        <label
          class="w-20 text-sm font-medium text-gray-700 mr-4 flex items-center h-12"
          >会員登録日</label
        >
        <div class="flex !w-full flex-col">
          <div class="date-range-container">
            <div class="date-input-wrapper">
              <Calendar
                v-model="startDateComputed"
                dateFormat="yy/mm/dd"
                showIcon
                :showOtherMonths="true"
                :selectOtherMonths="true"
                class="date-input"
              />
              <div class="error-message-container">
                <Message
                  v-if="errors.started_date_from"
                  severity="error"
                  size="small"
                  variant="simple"
                >
                  {{ errors.started_date_from }}
                </Message>
              </div>
            </div>
            <span class="date-separator">~</span>
            <div class="date-input-wrapper">
              <Calendar
                v-model="endDateComputed"
                dateFormat="yy/mm/dd"
                showIcon
                :showOtherMonths="true"
                :selectOtherMonths="true"
                class="date-input"
              />
              <div class="error-message-container">
                <Message
                  v-if="errors.started_date_to"
                  severity="error"
                  size="small"
                  variant="simple"
                >
                  {{ errors.started_date_to }}
                </Message>
              </div>
            </div>
          </div>
          <div class="min-h-9 max-w-full min-w-full">
            <!-- Empty error container for consistent spacing -->
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="form-row">
        <div class="w-20 mr-4"></div>
        <!-- Empty space to align with other rows -->
        <div class="flex gap-4">
          <Button
            type="button"
            label="クリア"
            @click="clear"
            class="px-6 py-2 text-sm"
            severity="secondary"
          />
          <Button
            type="submit"
            label="検索"
            class="px-6 py-2 text-sm"
            severity="primary"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Form row consistent spacing */
.form-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem; /* 24px consistent spacing between rows */
}

.form-row:last-child {
  margin-bottom: 0; /* Remove margin from last row */
}

/* Date Range Container */
.date-range-container {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.date-input-wrapper {
  display: flex;
  flex-direction: column;
  min-width: 180px;
}

.date-input {
  width: 100%;
  min-width: 180px;
  height: 3rem; /* 48px - consistent with h-12 */
}

.date-separator {
  font-size: 0.875rem; /* Keep consistent with text-sm (14px) */
  color: #6b7280;
  margin-top: 1.5rem; /* Align with the center of the input fields */
  font-weight: 500;
  align-self: flex-start;
  height: 1.5rem;
  display: flex;
  align-items: center;
}

.error-message-container {
  min-height: 2.25rem;
  display: flex;
  align-items: flex-start;
  padding-top: 0.25rem;
}

/* Responsive adjustments for date range */
@media (max-width: 768px) {
  .date-range-container {
    flex-direction: column;
    gap: 0.5rem;
  }

  .date-separator {
    margin-top: 0;
    align-self: center;
    transform: rotate(90deg);
  }

  .date-input-wrapper {
    width: 100%;
    min-width: auto;
  }
}

/* Calendar input styling */
:deep(.p-calendar) {
  width: 100%;
  height: 3rem; /* 48px - consistent with h-12 */
}

:deep(.p-calendar .p-inputtext) {
  width: 100%;
  height: 3rem; /* 48px - consistent with h-12 */
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  box-sizing: border-box;
  font-size: 0.875rem; /* Consistent with text-sm (14px) */
}

:deep(.p-calendar .p-inputtext:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

:deep(.p-calendar .p-datepicker-trigger) {
  background: #f9fafb;
  border: 1px solid #d1d5db;
  border-left: none;
  padding: 0.75rem;
  color: #6b7280;
  border-radius: 0 0.375rem 0.375rem 0;
  height: 3rem; /* 48px - consistent with h-12 */
  box-sizing: border-box;
}

:deep(.p-calendar .p-datepicker-trigger:hover) {
  background: #f3f4f6;
  color: #374151;
}

/* Ensure consistent text sizing across all components */
:deep(.p-inputtext) {
  font-size: 0.875rem; /* Consistent with text-sm (14px) */
  height: 3rem; /* 48px - consistent with h-12 and calendar inputs */
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-sizing: border-box;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
}

:deep(.p-inputtext:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

:deep(.p-button .p-button-label) {
  font-size: 0.875rem; /* Consistent with text-sm (14px) */
}

:deep(.p-message .p-message-text) {
  font-size: 0.875rem; /* Consistent with text-sm (14px) */
}
</style>
