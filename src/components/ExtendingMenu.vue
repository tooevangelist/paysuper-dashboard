<script>
import { VPopover } from 'v-tooltip';

export default {
  name: 'ExtendingMenu',

  components: {
    'v-popover': VPopover,
  },

  props: {
    /**
     * @typedef {{label: string, url?: string, router?: boolean}} Breadcrumb
     * @type {Breadcrumb[]}
     */
    items: {
      required: true,
      type: Array,
    },
  },

  methods: {
    handleItemClick(item) {
      if (item.handler) {
        item.handler();
      }
    },
  },
};
</script>

<template>
  <v-popover
    trigger="hover"
    placement="auto"
  >
    <!-- This will be the popover target (for the events and position) -->
    <div class="dropdown-icon">
      <svg width="19" height="4" viewBox="0 0 19 4" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- eslint-disable-next-line -->
        <path d="M4.60201 2C4.60201 3.10457 3.69883 4 2.5847 4C1.47056 4 0.567383 3.10457 0.567383 2C0.567383 0.89543 1.47056 0 2.5847 0C3.69883 0 4.60201 0.89543 4.60201 2Z" fill="#C4C4C4"/>
        <!-- eslint-disable-next-line -->
        <path d="M11.6626 2C11.6626 3.10457 10.7594 4 9.64529 4C8.53116 4 7.62798 3.10457 7.62798 2C7.62798 0.89543 8.53116 0 9.64529 0C10.7594 0 11.6626 0.89543 11.6626 2Z" fill="#C4C4C4"/>
        <!-- eslint-disable-next-line -->
        <path d="M18.7232 2C18.7232 3.10457 17.82 4 16.7059 4C15.5918 4 14.6886 3.10457 14.6886 2C14.6886 0.89543 15.5918 0 16.7059 0C17.82 0 18.7232 0.89543 18.7232 2Z" fill="#C4C4C4"/>
      </svg>
    </div>


    <div class="dropdown-content" slot="popover">
      <template v-for="(item, index) in items">
        <router-link
          v-if="item.url && item.router !== false"
          class="dropdown-content__item"
          :to="item.url"
          :key="index"
          v-text="item.label"
        />
        <a
          v-else
          class="dropdown-content__item"
          :href="item.url || '#'"
          :key="index"
          v-text="item.label"
          @click.prevent="handleItemClick(item)"
        />
      </template>
    </div>
  </v-popover>
</template>

<style lang="scss" scoped>
.extending-menu {
}

.dropdown-icon {
  display: inline-flex;
  height: 30px;
  width: 30px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.dropdown-content {
  background-color: #fff;
  max-height: 220px;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.25);

  &__item {
    cursor: pointer;
    display: block;
    height: 40px;
    line-height: 40px;
    padding: 0 16px;
    margin: 0;
    color: #999999;
    text-decoration: none;

    &:hover,
    &._current {
      background-color: #deebfa;
    }

    &._empty {
      color: #b1b1b1;
    }
  }
}
</style>
