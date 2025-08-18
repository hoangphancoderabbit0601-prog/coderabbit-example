<template>
  <Button type="button" label="CSV出力" @click="handleClick" />
</template>

<script lang="ts" setup>
import { SearchOrderResponseType } from '@factory/order';
import Button from 'primevue/button';
import { ref } from 'vue';

const props = defineProps<{
  animate?: boolean;
  filename?: string;
  getData?: () => Promise<SearchOrderResponseType[]>;
}>();

const animating = ref(false);

const handleClick = async () => {
  if (animating.value) return;
  animating.value = true;
  setTimeout(() => (animating.value = false), 850);

  if (props.getData) {
    const data = await props.getData();
    if (data && data.length > 0) {
      const csvContent = generateCSV(data);
      downloadCSV(csvContent, props.filename || 'orders.csv');
    }
  }
};

const generateCSV = (data: SearchOrderResponseType[]) => {
  const headers = [
    '"注文ID"',
    '"商品名"',
    '"商品コード"',
    '"注文数量"',
    '"顧客名"',
    '"注文日"',
    '"更新日"',
    '"削除日"',
  ];

  const csvRows: string[] = [];

  data.forEach((order) => {
    const row = [
      `"${order.id || ''}"`,
      `"${order.item_name || ''}"`,
      `"${order.item_code || ''}"`,
      `"${order.item_quantity || ''}"`,
      `"${order.customer?.name || ''}"`,
      `"${order.created_date || ''}"`,
      `"${order.updated_date || ''}"`,
      `"${order.deleted_date || ''}"`,
    ];

    csvRows.push(row.join(','));
  });

  return [headers.join(','), ...csvRows].join('\n');
};

const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
</script>
