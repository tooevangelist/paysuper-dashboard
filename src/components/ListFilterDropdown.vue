<script>
import { UiSelect } from '@protocol-one/ui-kit';
import { VPopover } from 'v-tooltip';

export default {
  name: 'ListFilterDropdown',

  components: {
    'v-popover': VPopover,
    UiSelect,
  },

  props: {
    options: {
      type: Array,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },

  computed: {
    filterIconFillColor() {
      if (this.value) {
        return '#000';
      }
      return '#B1B1B1';
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
      <span class="dropdown-icon__text">
        <slot></slot>
      </span>
      <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0L4 4V8L6.66667 7.33333V4L10.6667 0H0Z" :fill="filterIconFillColor"/>
      </svg>
    </div>

    <div class="dropdown-content" slot="popover">
      <UiSelect
        label="Filter"
        :options="options"
        :value="value"
        @input="$emit('change', $event)"
      ></UiSelect>
    </div>
  </v-popover>
</template>

<style lang="scss" scoped>
.extending-menu {
}

.dropdown-icon {
  display: flex;
  align-items: center;
  cursor: pointer;

  &__text {
    margin-right: 5px;
  }
}

.dropdown-content {
  padding: 6px 16px 0;
  background-color: #fff;
  width: 200px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.25);
}
</style>
