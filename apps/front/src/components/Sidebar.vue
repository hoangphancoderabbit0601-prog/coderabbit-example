<template>
  <div id="sidebar" class="sidebar">
    <ul id="sidebar-nav" class="sidebar-nav">
      <li
        class="nav-item"
        :class="['nav-item', { active: side === ROUTE_MENUS.CUSTOMER }]"
      >
        <router-link
          class="nav-link"
          :to="{ name: SCREEN_NAMES.CUSTOMER_LIST }"
        >
          <i class="pi pi-user"></i>
          <span class="p-drawer-header">顧客一覧</span>
        </router-link>
      </li>

      <li
        :class="[
          'nav-item',
          { active: side === ROUTE_MENUS.ORDER },
          isHidden([Position.Administrator]) ? 'hidden' : '',
        ]"
      >
        <router-link class="nav-link" :to="{ name: SCREEN_NAMES.ORDER_LIST }">
          <i class="pi pi-box"></i>
          <span class="p-drawer-header" style="">注文一覧</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { Position } from '@factory/customer';
import { find, includes, map } from 'lodash';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { useAppStorage } from '@/composables';
import { ROUTE_MENUS, SCREEN_NAMES } from '@/constants';

const { userInfo } = useAppStorage();
const route = useRoute();
const isHidden = (permission) => {
  return !includes(permission, userInfo?.value?.positionId);
};

const side = computed(() => {
  const routePathList = map(route.matched, (item) => item.path);
  return find(ROUTE_MENUS, (value) => {
    return includes(routePathList, '/' + value);
  });
});
</script>

<style lang="scss">
.sidebar {
  position: fixed;
  top: 60px;
  left: 0;
  bottom: 0;
  width: 240px;
  z-index: 10;
  transition: all 0.3s;
  padding: 20px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #aab7cf transparent;
  box-shadow: 0px 0px 20px rgba(1, 41, 112, 0.1);

  background-color: var(--p-green-600);

  @media (max-width: 1199px) {
    left: -240px;
  }

  &::-webkit-scrollbar {
    width: 5px;
    height: 8px;
    background-color: #fff;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #aab7cf;
  }

  .p-drawer-header {
    padding: 1rem;
    background-color: var(--blue-color);
    color: #fff;
    font-weight: bold;
  }

  .p-drawer-content {
    padding: 0;
    background-color: var(--blue-color);
    color: #fff;
  }
}

@media (min-width: 1200px) {
  #main,
  #footer {
    padding-left: 240px;
  }
}

.toggle-sidebar {
  @media (max-width: 1199px) {
    .sidebar {
      left: 0;
    }
  }

  @media (min-width: 1200px) {
    #main,
    #footer {
      padding-left: 0;
    }

    .sidebar {
      left: -240px;
    }
  }
}

.sidebar-nav {
  padding: 0;
  margin: 5px 0px;
  list-style: none;

  .nav-item.active {
    background-color: crimson;
    color: white;
  }

  .nav-item {
    margin-bottom: 5px;

    .nav-heading {
      font-size: 11px;
      text-transform: uppercase;
      color: #899bbd;
      font-weight: 600;
      margin: 10px 0 5px 15px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      font-size: 15px;
      font-weight: 600;
      transition: 0.3s linear;
      margin-bottom: 10px;
      padding: 10px 15px;
      border-radius: 4px;
      color: #fff;
      height: 46px;

      i {
        font-size: 16px;
        margin-right: 10px;
        color: #fff;
      }

      &.sidebar-active {
        color: #fff;
        background: var(--blue-hover-color);

        i {
          color: #fff !important;
        }

        &:hover {
          color: #fff;
          background: var(--blue-hover-color);

          i {
            color: #fff;
          }
        }
      }

      &:hover {
        color: #fff;
        background: var(--blue-hover-color);

        i {
          color: #fff;
        }
      }

      .bi-chevron-down {
        margin-right: 0;
        transition: transform 0.2s ease-in-out;
      }

      &.collapsed .bi-chevron-down {
        transform: rotate(180deg);
      }

      .nav-content {
        padding: 5px 0 0 0;
        margin: 0;
        list-style: none;

        a {
          display: flex;
          align-items: center;
          font-size: 14px;
          font-weight: 600;
          color: var(--primary-color);
          transition: 0.3;
          padding: 10px 0 10px 40px;
          transition: 0.3s;

          i {
            font-size: 6px;
            margin-right: 8px;
            line-height: 0;
            border-radius: 50%;
          }

          &:hover,
          &.active {
            color: #4154f1;

            i {
              background-color: #4154f1;
            }
          }
        }
      }
    }
  }
}

hidden {
  display: none;
}
</style>
