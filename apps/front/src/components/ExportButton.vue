<template>
  <Button
    type="button"
    label="Export CSV"
    icon="pi pi-file-export"
    iconPos="left"
    @click="handleClick"
  />
</template>

<script lang="ts" setup>
import { Position } from '@factory/user';
import dayjs from 'dayjs';
import Button from 'primevue/button';
import { ref } from 'vue';

import { useErrorHandler, useQuery } from '@/composables';
import { userService } from '@/services';
import { stringFlag } from '@/utils/html';

const props = defineProps<{
  animate?: boolean;
  action?: string;
  data: {
    name: string;
    dateFrom?: string;
    dateTo?: string;
  };
  clickHandler?: () => Promise<void> | void;
}>();

const animating = ref(false);

const { result, error, refetch } = useQuery(userService.search, {
  name: props.data.name,
  dateFrom: props.data.dateFrom || '',
  dateTo: props.data.dateTo || '',
  offset: undefined,
  limit: undefined,
});

useErrorHandler(error);

const handleClick = async () => {
  if (props.clickHandler) {
    await props.clickHandler();
  }

  if (animating.value) return;
  animating.value = true;
  setTimeout(() => (animating.value = false), 850);

  await refetch({
    name: props.data.name,
    dateFrom: props.data.dateFrom || '',
    dateTo: props.data.dateTo || '',
    offset: undefined,
    limit: undefined,
  });

  if (result?.data) {
    const csvContent = generateCSV(result.data);
    downloadCSV(csvContent, 'data.csv');
  } else {
    console.error('No data available to export');
  }
};

const generateCSV = (data: any[]) => {
  const headers = [
    'ID',
    'User Name',
    'Email',
    'Group ID',
    'Group Name',
    'Started Date',
    'Position',
    'Created Date',
    'Updated Date',
  ];

  const csvRows = data.map((item) => {
    return [
      item.id,
      item.name,
      item.email,
      item.groupId,
      item.group ? item.group.name : '',
      item.startedDate,
      stringFlag(Position, item.positionId),
      dayjs.tz(item.createdDate).format('YYYY-MM-DD'),
      dayjs.tz(item.updatedDate).format('YYYY-MM-DD'),
    ].join(',');
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
