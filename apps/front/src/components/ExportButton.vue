<template>
  <Button type="button" label="CSV出力" @click="handleClick" />
</template>

<script lang="ts" setup>
import { SearchCustomerResponseType } from '@factory/customer';
import { join } from 'lodash';
import Button from 'primevue/button';
import { ref } from 'vue';

const props = defineProps<{
  animate?: boolean;
  filename?: string;
  getData?: () => Promise<SearchCustomerResponseType[]>;
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
      downloadCSV(csvContent, props.filename || 'customers.csv');
    }
  }
};

const generateCSV = (data: SearchCustomerResponseType[]) => {
  const headers = [
    '"ID"',
    '"Customer Name"',
    '"Email"',
    '"Order ID"',
    '"Item Name"',
    '"Started Date"',
    '"Position"',
    '"Created Date"',
    '"Updated Date"',
  ];

  const csvRows: string[] = [];

  data.forEach((customer) => {
    const orderIdList = join(
      customer.orders.map((order) => order.id),
      ',',
    );
    const itemNameList = join(
      customer.orders.map((order) => order.item_name),
      ',',
    );
    const row = [
      `"${customer.id || ''}"`,
      `"${customer.name || ''}"`,
      `"${customer.email || ''}"`,
      `"${orderIdList}"`,
      `"${itemNameList}"`,
      `"${customer.started_date || ''}"`,
      `"${customer.position_id || ''}"`,
      `"${customer.created_date || ''}"`,
      `"${customer.updated_date || ''}"`,
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
