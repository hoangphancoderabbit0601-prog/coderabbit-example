<script setup lang="ts">
import { messageFrontError } from '@factory/_constant';
import { SearchOrderResponseType, SearchOrderType } from '@factory/order';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Paginator from 'primevue/paginator';
import { ref, toRaw } from 'vue';

import ImportButton from '@/components/ImportButton.vue';
import {
  useErrorHandler,
  useFlashMessageStorage,
  useLazyQuery,
} from '@/composables';
import { useLoading } from '@/composables/loading';
import { orderService } from '@/services';
import { PAGINATION_LIMIT } from '@/settings';

const isReset = ref<boolean>(false);
const totalRecords = ref<number>(0);
const listOrder = ref<SearchOrderResponseType[]>([]);
const backupSearchInput = ref<SearchOrderType>({
  limit: PAGINATION_LIMIT,
  offset: 1,
} as SearchOrderType);
const searchInput = ref<SearchOrderType>({
  limit: PAGINATION_LIMIT,
  offset: 1,
} as SearchOrderType);
const { result, error, refetch, isLoading } = useLazyQuery(
  orderService.searchOrder,
);

const { showFlashMessage } = useFlashMessageStorage();

useErrorHandler(error);
useLoading(isLoading);

// Fetch data on mount
async function refreshData() {
  if (isReset.value) {
    backupSearchInput.value = toRaw(searchInput.value);
    await refetch(toRaw(searchInput.value));
    listOrder.value = result?.data?.order || [];
    totalRecords.value = result?.data?.total_count || 0;
    isReset.value = false;
    if (!listOrder.value.length) {
      showFlashMessage({
        mode: 'warning',
        text: messageFrontError.ICL049(),
      });
    }
  }
}

const onPageChange = (event: { page: number }) => {
  searchInput.value.offset = event.page + 1;
  isReset.value = true;
  refreshData();
};

const handleImportSuccess = () => {
  isReset.value = true;
  refreshData();
};

const columns = ref([
  { field: 'id', header: '注文ID' },
  { field: 'item_name', header: '商品名' },
  { field: 'item_code', header: '商品コード' },
  { field: 'item_quantity', header: '注文数量' },
  { field: 'customer_name', header: '顧客名' },
  { field: 'created_date', header: '注文日' },
  { field: 'updated_date', header: '更新日' },
  { field: 'deleted_date', header: '削除日' },
]);

// Initialize data
isReset.value = true;
refreshData();
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">Order List</h1>
  <div>
    <div class="bg-primary-bg w-full h-full rounded-lg">
      <DataTable
        :value="listOrder"
        :loading="isLoading"
        showGridlines
        tableStyle="min-width: 50rem; table-layout: fixed"
      >
        <template v-for="col in columns" :key="col.field">
          <Column
            v-if="col.field === 'customer_name'"
            :field="col.field"
            :header="col.header"
          >
            <template #body="{ data }">
              <span>{{ data.customer?.name || '' }}</span>
            </template>
          </Column>
          <Column
            v-else-if="col.field === 'id'"
            :field="col.field"
            :header="col.header"
          >
            <template #body="{ data }">
              <h1 class="!text-center">{{ data.id }}</h1>
            </template>
          </Column>
          <Column
            v-else-if="col.field === 'item_quantity'"
            :field="col.field"
            :header="col.header"
          >
            <template #body="{ data }">
              <span>{{ data.item_quantity }}</span>
            </template>
          </Column>
          <Column
            v-else-if="col.field === 'deleted_date'"
            :field="col.field"
            :header="col.header"
          >
            <template #body="{ data }">
              <span>{{ data.deleted_date || '' }}</span>
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

      <!-- No Records Message -->
      <div v-if="listOrder.length === 0" class="text-center p-4">
        <span class="text-gray-600">{{ messageFrontError.ICL050() }}</span>
      </div>

      <Paginator
        :rows="PAGINATION_LIMIT"
        @page="onPageChange"
        :totalRecords="totalRecords || 0"
        class="custom-paginator"
      />
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-4 mt-4 p-4">
      <ImportButton @refresh-data="handleImportSuccess" />
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

/* Background styles */
.bg-primary-bg {
  background-color: #f8fafc;
}
</style>
