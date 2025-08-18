<script setup lang="ts">
import {
  CreateCustomerType,
  Position,
  upsertCustomerFrontSchema,
  UpsertCustomerFrontType,
} from '@factory/customer';
import dayjs from 'dayjs';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Password from 'primevue/password';
import { computed, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useErrorHandler, useLazyQuery, useMutation } from '@/composables';
import useAlert from '@/composables/alert';
import { useFormWithSchema } from '@/composables/form';
import { useLoading } from '@/composables/loading';
import { useAppStorage } from '@/composables/storage';
import { SCREEN_NAMES } from '@/constants';
import { customerService } from '@/services';

const route = useRoute();
const router = useRouter();
const { confirm } = useAlert();
const { userInfo } = useAppStorage();

const customerId = computed(() => route.params.id as string | undefined);
const isEditMode = computed(() => !!customerId.value);

// Position options for select dropdown
const positionOptions = [
  { label: '-', value: '-1' },
  { label: '管理者', value: Position.Administrator },
  { label: 'グループ管理者', value: Position.Group },
  { label: '一般ユーザ', value: Position.User },
];

// Form setup - use the schema value directly since it's reactive
const { models, errors, values, setData, validate, safeLeave, validateField } =
  useFormWithSchema(upsertCustomerFrontSchema, true);

// Fetch customer data for edit mode
const {
  error: customerError,
  refetch: fetchCustomer,
  isLoading: isLoadingCustomer,
  result: customerResult,
} = useLazyQuery(customerService.getCustomerById);

const {
  mutate: updateCustomer,
  error: updateError,
  isLoading: isLoadingUpdate,
  result: updateResult,
} = useMutation(customerService.updateCustomer);
const {
  mutate: createCustomer,
  error: createError,
  isLoading: isLoadingCreate,
  result: createResult,
} = useMutation(customerService.createCustomer);

const {
  mutate: deleteCustomer,
  error: deleteError,
  isLoading: isLoadingDelete,
} = useMutation(customerService.deleteCustomer);

useErrorHandler(customerError);
useErrorHandler(updateError);
useErrorHandler(createError);
useErrorHandler(deleteError);
useLoading(isLoadingCustomer);
useLoading(isLoadingUpdate);
useLoading(isLoadingCreate);
useLoading(isLoadingDelete);

const getPositionValue = (positionLabel: string): number => {
  for (const option of positionOptions) {
    if (option.label === positionLabel) {
      return Number(option.value);
    }
  }
  return -1;
};

// Load customer data when in edit mode
onBeforeMount(async () => {
  if (isEditMode.value && customerId.value) {
    await fetchCustomer(customerId.value, { changeRoute: false });
    setData({
      email: customerResult.data?.customer.email,
      isEdit: true,
      name: customerResult.data?.customer.name,
      position_id: getPositionValue(
        customerResult.data?.customer?.position_id as string,
      ),
      started_date: customerResult.data?.customer.started_date || '',
    });
  }
});

// Format started_date for Calendar component (Date object)
const formattedStartedDate = computed({
  get: () => {
    const dateStr = models.started_date.value?.trim();
    return dateStr ? new Date(dateStr) : null;
  },
  set: (val: Date | null) => {
    models.started_date.value = val ? dayjs(val).format('YYYY/MM/DD') : '';
  },
});

// Handle form submission
const onSubmit = async () => {
  if (models.position_id.value == -1) {
    models.position_id.value = null as any;
  }
  const isValid = (await validate()).valid;
  if (!isValid) {
    return validate();
  }
  const formData = values as UpsertCustomerFrontType;
  if (isEditMode.value && customerId.value) {
    // Update customer
    await updateCustomer(customerId.value, formData as UpsertCustomerFrontType);
  } else {
    // Create customer
    await createCustomer(formData as CreateCustomerType);
  }
  const isSuccess = updateResult?.value?.id || createResult?.value?.id;
  if (isSuccess) {
    safeLeave();
    router.push({ name: SCREEN_NAMES.CUSTOMER_LIST });
  }
};

// Handle delete action
const onDelete = async () => {
  if (!isEditMode.value || !customerId.value) return;

  const result = await confirm('このお客さんを削除してもいいですか？');
  if (result.isConfirmed) {
    await deleteCustomer(customerId.value);
    safeLeave();
    router.push({ name: SCREEN_NAMES.CUSTOMER_LIST });
  }
};

// Handle cancel action
const onCancel = () => {
  router.push({ name: SCREEN_NAMES.CUSTOMER_LIST });
};

// Check if user can delete (only administrators)
const canDelete = computed(
  () =>
    userInfo.value?.positionId === Position.Administrator && isEditMode.value,
);
const checkPermission = () => {
  return userInfo.value?.positionId === Position.Administrator;
};
</script>

<template>
  <div class="p-6">
    <form @submit.prevent="onSubmit" class="space-y-6">
      <div class="grid grid-cols-2">
        <!-- Left Column -->
        <div class="left flex flex-col space-y-6">
          <!-- Customer ID -->
          <div class="grid grid-cols-[130px_1fr] gap-4 items-center">
            <label class="field-label">顧客ID</label>
            <div class="field-input-container">
              <InputText :value="customerId" disabled class="w-full" />
              <div class="field-error-container">
                <!-- No error for disabled field -->
              </div>
            </div>
          </div>

          <!-- Email -->
          <div class="grid grid-cols-[130px_1fr] gap-4 items-center">
            <label class="field-label">
              メールアドレス <span class="text-red-500">*</span>
            </label>
            <div class="field-input-container">
              <InputText
                v-model="models.email.value"
                type="email"
                :disabled="!checkPermission()"
                :class="['w-full', errors.email ? 'border-red-600' : '']"
                @blur="validateField('email')"
              />
              <div class="field-error-container">
                <Message
                  v-if="errors.email"
                  severity="error"
                  size="small"
                  variant="simple"
                  class="mt-1"
                >
                  {{ errors.email }}
                </Message>
              </div>
            </div>
          </div>

          <!-- Started Date -->
          <div class="grid grid-cols-[130px_1fr] gap-4 items-center">
            <label class="field-label">
              会員登録日 <span class="text-red-500">*</span>
            </label>
            <div class="field-input-container">
              <Calendar
                v-model="formattedStartedDate"
                dateFormat="yy/mm/dd"
                :disabled="!checkPermission()"
                :class="['w-full', errors.started_date ? 'border-red-600' : '']"
                @blur="validateField('started_date')"
                showIcon
              />
              <div class="field-error-container">
                <Message
                  v-if="errors.started_date"
                  severity="error"
                  size="small"
                  variant="simple"
                  class="mt-1"
                >
                  {{ errors.started_date }}
                </Message>
              </div>
            </div>
          </div>
        </div>
        <!-- Right Column -->
        <div class="right flex flex-col space-y-6">
          <!-- Customer Name -->
          <div class="grid grid-cols-[130px_1fr] gap-4 items-center">
            <label class="field-label">
              顧客名 <span class="text-red-500">*</span>
            </label>
            <div class="field-input-container">
              <InputText
                v-model="models.name.value"
                :disabled="!checkPermission()"
                :class="['w-full', errors.name ? 'border-red-600' : '']"
                @blur="validateField('name')"
              />
              <div class="field-error-container">
                <Message
                  v-if="errors.name"
                  severity="error"
                  size="small"
                  variant="simple"
                  class="mt-1"
                >
                  {{ errors.name }}
                </Message>
              </div>
            </div>
          </div>

          <!-- Position -->
          <div class="grid grid-cols-[130px_1fr] gap-4 items-center">
            <label class="field-label">
              役職 <span class="text-red-500">*</span>
            </label>
            <div class="field-input-container">
              <Dropdown
                v-model="models.position_id.value"
                :options="positionOptions"
                optionLabel="label"
                :disabled="!checkPermission()"
                optionValue="value"
                :class="['w-full', errors.position_id ? 'border-red-600' : '']"
                @blur="validateField('position_id')"
              />
              <div class="field-error-container">
                <Message
                  v-if="errors.position_id"
                  severity="error"
                  size="small"
                  variant="simple"
                  class="mt-1"
                >
                  {{ errors.position_id }}
                </Message>
              </div>
            </div>
          </div>

          <!-- Password -->
          <div class="grid grid-cols-[130px_1fr] gap-4 items-center">
            <label class="field-label">
              パスワード
              <span v-if="!isEditMode" class="text-red-500">*</span>
            </label>
            <div class="field-input-container">
              <Password
                v-model="models.password.value"
                toggleMask
                :feedback="false"
                :class="['w-full', errors.password ? 'border-red-600' : '']"
                @blur="validateField('password')"
              />
              <div class="field-error-container">
                <Message
                  v-if="errors.password"
                  severity="error"
                  size="small"
                  variant="simple"
                  class="mt-1"
                >
                  {{ errors.password }}
                </Message>
              </div>
            </div>
          </div>

          <!-- Password Confirmation -->
          <div class="grid grid-cols-[130px_1fr] gap-4 items-center">
            <label class="field-label">
              パスワード確認
              <span v-if="!isEditMode" class="text-red-500">*</span>
            </label>
            <div class="field-input-container">
              <Password
                v-model="models.rePassword.value"
                toggleMask
                :feedback="false"
                :class="['w-full', errors.rePassword ? 'border-red-600' : '']"
                @blur="validateField('rePassword')"
              />
              <div class="field-error-container">
                <Message
                  v-if="errors.rePassword"
                  severity="error"
                  size="small"
                  variant="simple"
                  class="mt-1"
                >
                  {{ errors.rePassword }}
                </Message>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-4 pt-6">
        <Button
          type="submit"
          :label="isEditMode ? '更新' : '作成'"
          class="p-button-primary"
        />

        <Button
          v-if="canDelete"
          type="button"
          label="削除"
          class="p-button-danger"
          @click="onDelete"
        />

        <Button
          type="button"
          label="キャンセル"
          class="p-button-text"
          @click="onCancel"
        />
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Custom styling for form layout */
.p-inputtext:focus,
.p-dropdown:focus,
.p-password input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

.border-red-600 {
  border-color: #dc2626 !important;
}

.text-red-500 {
  color: #ef4444;
}

.text-red-600 {
  color: #dc2626;
}

/* Improved layout spacing - Full screen responsive */
.left,
.right {
  min-width: 100%;
  width: 100%;
}

.left .grid,
.right .grid {
  grid-template-columns: 130px 1fr;
  gap: 20px;
  margin-bottom: 16px;
  align-items: center;
}

.left .grid:last-child,
.right .grid:last-child {
  margin-bottom: 0;
}

/* Reduce gap between the two columns */
.flex.flex-row {
  gap: 30px;
}

/* Label styling for horizontal alignment */
.field-label {
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
  text-align: left;
  padding-right: 8px;
  display: flex;
  align-items: center;
  min-height: 40px; /* Match input height */
}

/* Remove old label styling as we're using field-label class now */
.left label,
.right label {
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
  text-align: left;
  padding-right: 8px;
  display: flex;
  align-items: center;
  min-height: 40px;
}

/* Input field consistency - 100% width */
.w-full {
  width: 100% !important;
  max-width: 100%;
}

/* PrimeVue component sizing - 100% width */
:deep(.p-inputtext) {
  width: 100%;
  max-width: 100%;
}

:deep(.p-dropdown) {
  width: 100%;
  max-width: 100%;
}

:deep(.p-password) {
  width: 100%;
  max-width: 100%;
}

:deep(.p-password .p-inputtext) {
  width: 100%;
}

:deep(.p-calendar) {
  width: 100%;
  max-width: 100%;
}

/* Error message styling */
small.text-red-600 {
  font-size: 12px;
  margin-top: 2px;
}

/* Better spacing for form sections */
.space-y-6 > * + * {
  margin-top: 0 !important;
}

.space-y-6 {
  gap: 20px;
}

/* Responsive design */
@media (max-width: 768px) {
  .grid-cols-2 {
    grid-template-columns: 1fr;
    gap: 50px;
  }

  .grid.grid-cols-\[130px_1fr\] {
    grid-template-columns: 1fr;
    gap: 5px;
  }

  .field-label,
  .left label,
  .right label {
    text-align: left;
    margin-bottom: 5px;
    min-height: auto;
  }

  .w-full,
  :deep(.p-inputtext),
  :deep(.p-dropdown),
  :deep(.p-password),
  :deep(.p-calendar) {
    max-width: 100%;
  }
}

/* Form container improvements - Full screen */
.p-6 {
  padding: 1.5rem;
  max-width: 100%;
  width: 100%;
  min-height: 100vh;
}

.text-2xl {
  margin-bottom: 1.5rem;
}

.field-error-container {
  min-height: 1.5rem;
  max-height: 1.5rem;
}

.field-input-container {
  min-height: 4rem;
  max-height: 4rem;
}

.disable {
  pointer-events: none;
  opacity: 0.6;
}
</style>
