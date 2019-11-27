<script>
import { find, get } from 'lodash-es';
import ClickOutside from 'vue-click-outside';

export default {
  name: 'UiLabelSwitch',

  directives: {
    ClickOutside,
  },

  props: {
    value: {
      type: String,
      required: true,
    },
    scheme: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      isDropdownOpened: false,
    };
  },

  methods: {
    getLabelColor() {
      return get(find(this.scheme, { value: this.value }), 'color');
    },

    getItemClass(item) {
      return [
        item.color ? `_${item.color}` : '',
        item.value === this.value ? '_current' : '',
      ];
    },

    getRoleName(code) {
      return get(find(this.scheme, { value: code }), 'status');
    },

    labelClick() {
      this.isDropdownOpened = !this.isDropdownOpened;
    },

    handleClick(item) {
      this.$emit('input', item);
      this.isDropdownOpened = !this.isDropdownOpened;
    },
  },
};
</script>

<template>
  <div class="switch-menu" v-click-outside="() => isDropdownOpened = false">
    <div class="switch-menu__label" @click.stop.prevent="labelClick">
      <UiLabelTag class="switch" :class="{ opened: isDropdownOpened }" :color="getLabelColor()">
        {{ getRoleName(this.value) }} <span class="triangle"></span>
      </UiLabelTag>
    </div>

    <UiTip
      class="dropdown"
      position="bottom"
      width="200px"
      :margin="4"
      :visible="isDropdownOpened"
      :closeDelay="0"
      :stayOpenedOnHover="false"
    >
      <div class="dropdown-content">
        <div
          class="status"
          v-for="(item, index) in scheme"
          :key="index"
          :class="getItemClass(item, value)"
          @click.stop.prevent="handleClick(item)"
        >
          <component
            class="status-icon"
            v-if="item.icon"
            :is="item.icon"
          />
          {{ getRoleName(item.value) }}
        </div>
      </div>
    </UiTip>
  </div>
</template>

<style lang="scss" scoped>
.switch-menu {
  position: relative;
}
.switch {
  position: relative;
  cursor: pointer;
  width: 130px;

  .triangle {
    position: absolute;
    right: 12px;
    top: 10px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 4px 4px 0 4px;
    border-color: #ffffff transparent transparent transparent;
    transition: all .2s ease-out;
  }

  &.opened .triangle {
    transform: rotate(180deg);
  }
}

.status {
  font-size: 14px;
  line-height: 20px;
  color: #000000;
  position: relative;
  padding: 0 16px 0 32px;
  height: 30px;
  display: flex;
  align-items: center;

  &:hover:not(._current) {
    cursor: pointer;
    background: rgba(61, 123, 245, 0.08);
    color: #3d7bf5;

    .triangle {
      border-color: transparent transparent transparent #3D7BF5;
    }
  }

  &::before {
    content: "";
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    left: 16px;
    top: 11px;
  }

  &._current {
    &,
    .status-count {
      color: #c6cacc;
    }
  }

  &._transparent {
    &::before {
      border: 1px solid #919699;
    }
  }
  &._grey {
    &::before {
      background: #C6CACC;
    }
  }
  &._gray {
    &::before {
      background: #919699;
    }
  }
  &._blue {
    &::before {
      background: #3d7bf5;
    }
  }
  &._yellow {
    &::before {
      background: #f3aa18;
    }
  }
  &._purple {
    &::before {
      background: #7e57c2;
    }
  }
  &._green {
    &::before {
      background: #2fa84f;
    }
  }
  &._red {
    &::before {
      background: #ea3d2f;
    }
  }
  &._cyan {
    &::before {
      background: #069697;
    }
  }
  &._archieved {
    border-top: 1px solid #f1f3f4;
    padding-top: 5px;
    height: 35px;
    margin-top: 5px;
  }
}
</style>
