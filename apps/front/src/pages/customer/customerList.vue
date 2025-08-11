<script setup lang="ts">
import { messageFrontError } from '@factory/_constant';
import {
  SearchCustomerResponseType,
  SearchCustomerType,
} from '@factory/customer';
import { map, max } from 'lodash';
import { onBeforeMount, ref, toRaw } from 'vue';
import { useRouter } from 'vue-router';

import ExportButton from '@/components/ExportButton.vue';
import SearchUser from '@/components/SearchUser.vue';
import {
  useErrorHandler,
  useFlashMessageStorage,
  useQuery,
} from '@/composables';
import { useLoading } from '@/composables/loading';
import { useAppStorage } from '@/composables/storage';
import { SCREEN_NAMES } from '@/constants';
import { customerService } from '@/services';
import { PAGINATION_LIMIT } from '@/settings';

const router = useRouter();
const { userInfo } = useAppStorage();
const isReset = ref<boolean>(false);
const totalRecords = ref<number>(0);
const listCustomer = ref<SearchCustomerResponseType[]>([]);
const backupSearchInput = ref<SearchCustomerType>({
  limit: PAGINATION_LIMIT,
  offset: 1,
} as SearchCustomerType);
const searchInput = ref<SearchCustomerType>({
  limit: PAGINATION_LIMIT,
  offset: 1,
} as SearchCustomerType);
const { result, error, refetch, isLoading } = useQuery(
  customerService.searchCustomer,
);

const { showFlashMessage } = useFlashMessageStorage();

useErrorHandler(error);
useLoading(isLoading);
// Fetch data on mount
onBeforeMount(async () => {
  isReset.value = true;
  refreshData();
});

const columns = ref([
  { field: 'name', header: '顧客名' },
  { field: 'email', header: 'メールアドレス' },
  { field: 'item_name', header: '注文商品' },
  { field: 'created_date', header: '注文日' },
  { field: 'started_date', header: '会員登録日' },
  {
    field: 'position_id',
    header: '役職',
  },
]);

async function refreshData() {
  if (isReset.value) {
    backupSearchInput.value = toRaw(searchInput.value);
    await refetch(toRaw(searchInput.value));
    listCustomer.value = result?.data?.customer || [];
    totalRecords.value = result?.data?.total_count || 0;
    isReset.value = false;
    if (!listCustomer.value.length) {
      showFlashMessage({
        mode: 'warning',
        text: messageFrontError.ICL049(),
      });
    }
  }
}

async function getData() {
  backupSearchInput.value.limit = undefined;
  backupSearchInput.value.offset = undefined;
  await refetch(toRaw(backupSearchInput.value));
  listCustomer.value = result?.data?.customer || [];
  return listCustomer.value;
}

const onPageChange = (event: { page: number }) => {
  searchInput.value.offset = event.page + 1;
  isReset.value = true;
  refreshData();
};

const onClickEdit = (customerId: string) => {
  router.push({
    name: SCREEN_NAMES.CUSTOMER_ADD_EDIT_DELETE,
    params: { id: customerId.toString() },
  });
};

const onClickCreate = () => {
  router.push({
    name: SCREEN_NAMES.CUSTOMER_ADD_EDIT_DELETE,
  });
};
</script>

<template>
  <div>
    <SearchUser
      v-model:searchInput="searchInput"
      v-model:isReset="isReset"
      @refresh-data="refreshData"
    />
  </div>
  <div>
    <h1 class="text-xl font-bold mb-4">検索結果</h1>
    <div class="bg-primary-bg w-5/6 h-full rounded-lg">
      <DataTable
        :value="listCustomer"
        :loading="isLoading"
        showGridlines
        tableStyle="min-width: 50rem; table-layout: fixed"
      >
        <template v-for="col in columns" :key="col.field">
          <Column
            v-if="col.field === 'name'"
            :field="col.field"
            :header="col.header"
          >
            <template #body="{ data }">
              <span
                v-if="userInfo?.positionId === 0"
                class="text-blue-600 cursor-pointer hover:underline"
                @click="onClickEdit(data.id)"
              >
                {{ data.name }}
              </span>
              <span v-else>
                {{ data.name }}
              </span>
            </template>
          </Column>
          <Column
            v-else-if="col.field === 'item_name'"
            :field="col.field"
            :header="col.header"
          >
            <template #body="{ data }">
              <span class="badge badge-info mr-1">
                {{ map(data.orders, (item) => `${item.item_name}`).join(', ') }}
              </span>
            </template>
          </Column>
          <Column
            v-else-if="col.field === 'created_date'"
            :field="col.field"
            :header="col.header"
          >
            <template #body="{ data }">
              <span class="badge badge-info mr-1">
                {{
                  max(
                    data.orders.map(
                      (item: { created_date: string }) => item.created_date,
                    ),
                  )
                }}
              </span>
            </template>
          </Column>

          <Column
            v-else
            :key="col.field"
            :field="col.field"
            :header="col.header"
          />
        </template>
      </DataTable>
      <Paginator
        :rows="PAGINATION_LIMIT"
        @page="onPageChange"
        :totalRecords="totalRecords || 0"
        class="custom-paginator"
      >
      </Paginator>

      <!-- Action Buttons -->
      <div v-if="userInfo?.positionId === 0" class="flex gap-4 mt-4 p-4">
        <Button label="作成" @click="onClickCreate" class="p-button-primary" />
        <ExportButton
          v-if="listCustomer.length"
          :getData="getData"
          filename="customers.csv"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom Paginator Styles */
.custom-paginator :deep(.p-paginator-first) .p-paginator-icon {
  display: none;
}
.custom-paginator :deep(.p-paginator-first)::after {
  content: '最初';
  color: black;
}

.custom-paginator :deep(.p-paginator-prev) .p-paginator-icon {
  display: none;
}
.custom-paginator :deep(.p-paginator-prev)::after {
  content: '前へ';
  color: black;
}

.custom-paginator :deep(.p-paginator-next) .p-paginator-icon {
  display: none;
}
.custom-paginator :deep(.p-paginator-next)::after {
  content: '次へ';
  color: black;
}

.custom-paginator :deep(.p-paginator-last) .p-paginator-icon {
  display: none;
}
.custom-paginator :deep(.p-paginator-last)::after {
  content: '最終';
  color: black;
}

/* Table Cell Text Wrapping */
:deep(.p-datatable .p-datatable-tbody td) {
  white-space: normal !important;
  word-wrap: break-word !important;
  word-break: break-word !important;
  overflow-wrap: break-word !important;
  max-width: 200px;
  padding: 0.5rem !important;
  vertical-align: top !important;
}

/* Specific styling for long text content */
:deep(.p-datatable .p-datatable-tbody td .badge) {
  white-space: normal !important;
  word-wrap: break-word !important;
  display: inline-block;
  max-width: 100%;
}
</style>
