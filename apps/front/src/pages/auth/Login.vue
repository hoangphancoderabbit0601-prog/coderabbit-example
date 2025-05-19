<template>
  <div class="login-card">
    <Form
      :initial-values="initialValues"
      :resolver="resolver"
      @submit="onFormSubmit"
      class="form"
    >
      <FormField
        v-slot="$field"
        as="section"
        name="email"
        class="form-group"
        aria-label="Email"
      >
        <InputText type="text" placeholder="Email" v-bind="$field" />
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $field.error?.message }}
        </Message>
      </FormField>

      <FormField v-slot="$field" asChild name="password">
        <section class="form-group">
          <Password
            type="text"
            placeholder="Password"
            :feedback="false"
            toggleMask
            fluid
            v-bind="$field"
          />
          <Message
            v-if="$field?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $field.error?.message }}
          </Message>
        </section>
      </FormField>

      <Button type="submit" severity="secondary" label="Submit" />
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
import { authService } from '@/services';

const initialValues = ref({
  email: '',
  password: '',
});

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
      accessToken.value = result?.token;
      const { redirectUrl } = route.query;

      router.push(
        typeof redirectUrl === 'string'
          ? { path: decodeURIComponent(redirectUrl) }
          : { name: 'user-search' },
      );
    }
  }
};
</script>
