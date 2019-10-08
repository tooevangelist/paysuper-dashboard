<script>
export default {
  name: 'PriceSuggestTable',

  props: {
    selectedIndex: {
      type: Number,
      default: -1,
    },
  },

  data() {
    return {
      items: [
        0.99, 1.99, 2.99, 3.99, 4.99, 5.99, 6.99, 7.99, 8.99, 9.99,
        10.99, 11.99, 12.99, 13.99, 14.99, 15.99, 16.99, 17.99, 18.99, 19.99,
        24.99, 29.99, 34.99, 39.99, 44.99, 49.99, 54.99, 59.99, 64.99, 69.99,
        74.99, 79.99, 84.99, 89.99, 99.99, 119.99, 129.99, 149.99, 199.99,
      ],
    };
  },
};
</script>

<template>
<div class="price-suggest-table">
  <span class="close" @click="$emit('close')">
    Close
    <IconClose width="8" height="8" />
  </span>
  <div class="items">
    <div
      class="item"
      v-for="(item, index) in items"
      :key="index"
      @click="$emit('select', item)"
    >
      {{ item }}
    </div>
  </div>
</div>
</template>


<style lang="scss" scoped>
.price-suggest-table {
  background: #ffffff;
  /* Shadow Dark · 24dp */
  box-shadow: 0px 8px 16px rgba(8, 35, 48, 0.1),
    0px 24px 32px rgba(8, 35, 48, 0.06);
  border-radius: 4px;
  padding: 30px 10px 10px 10px;
  position: relative;
}

.close {
  position: absolute;
  height: 30px;
  font-size: 12px;
  line-height: 16px;
  padding: 5px 16px;
  top: 4px;
  right: 0;
  cursor: pointer;
  color: #919699;

  & > svg {
    stroke: #919699;
  }

  &:hover {
    color: #3d7bf5;

    & > svg {
      stroke: #3d7bf5;
    }
  }
}

.items {
  position: relative;
  display: flex;
  flex-wrap: wrap;

  &::before {
    content: "";
    position: absolute;
    z-index: 1;
    background: #fff;
    width: 1px;
    top: 0;
    bottom: 0;
    right: 0;
  }

  &::after {
    content: "";
    position: absolute;
    z-index: 1;
    background: #fff;
    height: 1px;
    bottom: 0;
    left: 0;
    right: 0;
  }
}

.item {
  font-size: 14px;
  line-height: 20px;
  color: #000000;
  border-bottom: 1px solid #e3e5e6;
  border-right: 1px solid #e3e5e6;
  width: 10%;
  box-sizing: border-box;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover:not(._current) {
    background: #eff4fe;
    color: #3d7bf5;
  }

  &._current {
    color: #919699;
    background: #f7f9fa;
  }
}
</style>
