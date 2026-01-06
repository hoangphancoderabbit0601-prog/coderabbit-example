<template>
  <div class="login-card">
    <img
      class="m-auto"
      src="../../assets/FreshCart_Logo.png"
      width="150"
      alt="Logo"
    />
    <Form
      :initial-values="initialValues"
      :resolver="resolver"
      @submit="onFormSubmit"
      :validate-on-blur="true"
      :validate-on-value-update="false"
      class="form"
    >
      <FormField
        v-slot="$field"
        as="section"
        name="email"
        class="form-group flex"
        aria-label="Email"
      >
        <span class=""
          >メールアドレス
          <span class="text-red-500 font-bold">*</span>
        </span>
        <div class="!flex !flex-col">
          <InputText
            type="text"
            v-bind="$field"
            @blur="
              () => {
                onCheckValidate();
              }
            "
          />

          <div class="min-h-[1.5rem] mt-1">
            <Message
              v-if="$field?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $field.error?.message }}
            </Message>
          </div>
        </div>
      </FormField>

      <FormField v-slot="$field" asChild name="password">
        <section class="form-group !flex">
          <span class=""
            >パスワード <span class="text-red-500 font-bold">*</span></span
          >
          <div class="!flex !flex-col">
            <Password
              type="text"
              :feedback="false"
              toggleMask
              fluid
              v-bind="$field"
              @blur="
                () => {
                  onCheckValidate();
                }
              "
            />

            <div class="min-h-[2rem] mt-1">
              <Message
                v-if="$field?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $field.error?.message }}
              </Message>
            </div>
          </div>
        </section>
      </FormField>

      <Button type="submit" severity="secondary" label="ログイン" />
    </Form>
  </div>
</template>

<script setup lang="ts">
import { loginSchema } from '@factory/auth';
import { yupResolver } from '@primevue/forms/resolvers/yup';
import isNil from 'lodash/isNil';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useAppStorage } from '@/composables';
import { useMutation } from '@/composables/client';
import { useErrorHandler } from '@/composables/errorHandler';
import { useLoading } from '@/composables/loading';
import { useFlashMessageStorage } from '@/composables/storage';
import { SCREEN_NAMES } from '@/constants';
import { authService } from '@/services';
const initialValues = ref({
  email: '',
  password: '',
});

const onCheckValidate = () => {
  // Clear any existing flash messages/alerts when user interacts with form
  const { clearFlashMessage } = useFlashMessageStorage();
  clearFlashMessage();
};

const resolver = yupResolver(loginSchema);

const { accessToken } = useAppStorage();

const { mutate, error, flashText, isLoading } = useMutation(authService.login);
flashText.value = null;
useErrorHandler(error);
useLoading(isLoading);

const router = useRouter();
const route = useRoute();

const onFormSubmit = async (formData: any) => {
  const { valid, values } = formData;
  if (valid) {
    const result = await mutate(values);

    if (isNil(error.value)) {
      accessToken.value = result?.token.accessToken;
      const { redirectUrl } = route.query;

      router.push(
        typeof redirectUrl === 'string'
          ? { path: decodeURIComponent(redirectUrl) }
          : { name: SCREEN_NAMES.CUSTOMER_LIST },
      );
    }
  }
};
</script>
