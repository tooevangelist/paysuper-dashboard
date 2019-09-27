<template>
<div
  class="ui-table-cell"
  :class="[
    `_align-${align}`,
    `_valign-${valign}`,
    {
      '_head': isHead,
      '_is-sortable': isSortAvailable,
      ['_' + sortDirection]: sortDirection,
      '_no-padding': noPadding,
    }
  ]"
  :style="{ width }"
>
  <svg
    v-if="isSortAvailable && sortDirection"
    class="sort-arrow"
    width="8"
    height="10"
    viewBox="0 0 8 10"
  >
    <path
      d="M3.64645 9.35355C3.84171 9.54882 4.15829 9.54882 4.35355 9.35355L7.53553 6.17157C7.7308
        5.97631 7.7308 5.65973 7.53553 5.46447C7.34027 5.2692 7.02369 5.2692 6.82843 5.46447L4
        8.29289L1.17157 5.46447C0.976311 5.2692 0.659728 5.2692 0.464466 5.46447C0.269204 5.65973
        0.269204 5.97631 0.464466 6.17157L3.64645 9.35355ZM3.5 0L3.5 9H4.5L4.5 0L3.5 0Z"
    />
  </svg>
  <slot />
</div>
</template>

<script>
import { includes } from 'lodash-es';

export default {
  name: 'UiTableRow',

  props: {
    align: {
      default: 'center',
      type: String,
      validator(value) {
        return includes(['left', 'right', 'center'], value);
      },
    },
    valign: {
      default: 'middle',
      type: String,
      validator(value) {
        return includes(['top', 'middle', 'bottom'], value);
      },
    },
    isSortable: {
      default: false,
      type: Boolean,
    },
    sortDirection: {
      default: null,
      type: String,
      validator(value) {
        return includes(['asc', 'desc', null], value);
      },
    },
    width: {
      default: '',
      type: String,
    },
    noPadding: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      isHead: this.$parent.isHead || false,
    };
  },
  computed: {
    isSortAvailable() {
      return this.isHead && this.isSortable;
    },
  },
};
</script>

<style lang="scss" scoped>
.ui-table-cell {
  display: table-cell;
  padding: 9px 2px;
  border-bottom: 1px solid #e3e5e6;
  text-align: center;

  &._no-padding {
    padding: 0;
  }

  &._align-left {
    text-align: left;
  }

  &._align-center {
    text-align: center;
  }

  &._align-right {
    text-align: right;
  }

  &._valign-top {
    vertical-align: top;
  }

  &._valign-middle {
    vertical-align: middle;
  }

  &._valign-bottom {
    vertical-align: bottom;
  }

  &._head {
    color: #919699;
    border-bottom: 2px solid #e3e5e6;

    &._is-sortable {
      color: #0c2441;
      cursor: pointer;
    }

    &._asc {
      & > .sort-arrow {
        transform: rotate(180deg);
      }
    }
  }
}
.sort-arrow {
  fill: #919699;
  vertical-align: baseline;
}
</style>
