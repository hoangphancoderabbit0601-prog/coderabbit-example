<template>
  <div
    class="left-0 top-0 z-[90] flex h-screen w-screen items-center justify-center bg-gray-500/50 fill-current text-primary"
    :class="{ fixed: isShowLoading, hidden: !isShowLoading }"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      style="
        margin: auto;
        background: transparent;
        display: block;
        shape-rendering: auto;
      "
      width="204px"
      height="204px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <g transform="rotate(0 50 50)">
        <rect x="47" y="30" rx="3" ry="5.28" width="6" height="12">
          <animate
            attributeName="opacity"
            values="1;0"
            keyTimes="0;1"
            dur="1.0204081632653061s"
            begin="-0.8746355685131196s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
      <g transform="rotate(51.42857142857143 50 50)">
        <rect x="47" y="30" rx="3" ry="5.28" width="6" height="12">
          <animate
            attributeName="opacity"
            values="1;0"
            keyTimes="0;1"
            dur="1.0204081632653061s"
            begin="-0.728862973760933s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
      <g transform="rotate(102.85714285714286 50 50)">
        <rect x="47" y="30" rx="3" ry="5.28" width="6" height="12">
          <animate
            attributeName="opacity"
            values="1;0"
            keyTimes="0;1"
            dur="1.0204081632653061s"
            begin="-0.5830903790087464s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
      <g transform="rotate(154.28571428571428 50 50)">
        <rect x="47" y="30" rx="3" ry="5.28" width="6" height="12">
          <animate
            attributeName="opacity"
            values="1;0"
            keyTimes="0;1"
            dur="1.0204081632653061s"
            begin="-0.4373177842565598s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
      <g transform="rotate(205.71428571428572 50 50)">
        <rect x="47" y="30" rx="3" ry="5.28" width="6" height="12">
          <animate
            attributeName="opacity"
            values="1;0"
            keyTimes="0;1"
            dur="1.0204081632653061s"
            begin="-0.2915451895043732s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
      <g transform="rotate(257.14285714285717 50 50)">
        <rect x="47" y="30" rx="3" ry="5.28" width="6" height="12">
          <animate
            attributeName="opacity"
            values="1;0"
            keyTimes="0;1"
            dur="1.0204081632653061s"
            begin="-0.1457725947521866s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
      <g transform="rotate(308.57142857142856 50 50)">
        <rect x="47" y="30" rx="3" ry="5.28" width="6" height="12">
          <animate
            attributeName="opacity"
            values="1;0"
            keyTimes="0;1"
            dur="1.0204081632653061s"
            begin="0s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
    </svg>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';

import { LOADING_UUIDS_STORAGE } from '@/symbols';

const loadingUuidsStorage = inject(LOADING_UUIDS_STORAGE);
const isShowLoading = computed(() => loadingUuidsStorage?.value?.size || 0 > 0);
</script>
