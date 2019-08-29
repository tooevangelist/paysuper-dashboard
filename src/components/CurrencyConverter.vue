<script>
import ClickOutside from 'vue-click-outside';
import ExpandableCellText from '@/components/ExpandableCellText.vue';
import SimpleMenuItem from '@/components/SimpleMenuItem.vue';

export default {
  name: 'CurrencyConverter',

  components: {
    ExpandableCellText,
    SimpleMenuItem,
  },

  directives: {
    ClickOutside,
  },

  data() {
    return {
      currencyFrom: 'USD',
      currencyTo: 'EUR',
      currencies: [
        'USD',
        'EUR',
        'RUB',
      ],
      isCurrencyFromListOpened: false,
      isCurrencyToListOpened: false,
    };
  },

  methods: {
    selectItemFrom(value) {
      if (this.currencyFrom === value) {
        return;
      }
      this.currencyFrom = value;
      this.isCurrencyFromListOpened = false;
    },
    selectItemTo(value) {
      if (this.currencyTo === value) {
        return;
      }
      this.currencyTo = value;
      this.isCurrencyToListOpened = false;
    },
    switchCurrencies() {
      const value = this.currencyTo;
      this.currencyTo = this.currencyFrom;
      this.currencyFrom = value;
    },
  },
};
</script>

<template>
<div class="currency-converter">
  <div class="head">
    <div class="head-cell">From</div>
    <div class="head-cell"></div>
    <div class="head-cell">To</div>
    <div class="head-cell"></div>
    <div class="head-cell">Conversion rate</div>
  </div>
  <div class="body">
    <div
      class="body-cell _from"
      @click="isCurrencyFromListOpened = !isCurrencyFromListOpened"
      v-click-outside="() => (isCurrencyFromListOpened = false)"
    >
      <ExpandableCellText :isOpened="isCurrencyFromListOpened">
        {{currencyFrom}}
      </ExpandableCellText>
      <UiTip
        class="dropdown"
        innerPosition="left"
        position="bottom"
        width="180px"
        :visible="isCurrencyFromListOpened"
        :closeDelay="0"
        :stayOpenedOnHover="false"
      >
        <SimpleMenuItem
          v-for="(item, index) in currencies"
          v-text="item"
          :key="index"
          :isCurrent="currencyFrom === item"
          @click.native.stop="selectItemFrom(item)"
        />
      </UiTip>
    </div>
    <div
      class="body-cell _switch"
      @click="switchCurrencies"
    >
      <div class="button _active">
        <IconTwoArrowsToOutside />
      </div>
    </div>
    <div
      class="body-cell _to"
      @click="isCurrencyToListOpened = !isCurrencyToListOpened"
      v-click-outside="() => (isCurrencyToListOpened = false)"
    >
      <ExpandableCellText :isOpened="isCurrencyToListOpened">
        {{currencyTo}}
      </ExpandableCellText>
      <UiTip
        class="dropdown"
        innerPosition="left"
        position="bottom"
        width="180px"
        :visible="isCurrencyToListOpened"
        :closeDelay="0"
        :stayOpenedOnHover="false"
      >
        <SimpleMenuItem
          v-for="(item, index) in currencies"
          v-text="item"
          :key="index"
          :isCurrent="currencyTo === item"
          @click.native.stop="selectItemTo(item)"
        />
      </UiTip>
    </div>
    <div class="body-cell _equal">
      <div class="button">
        <IconEqualSign />
      </div>
    </div>
    <div class="body-cell _result">
      2,18
    </div>
  </div>
</div>
</template>

<style lang="scss" scoped>
.currency-converter {
  display: table;
  width: 100%;
}
.head,
.body {
  display: table-row;
}

.head-cell {
  display: table-cell;
  text-align: center;
  color: #919699;
  font-size: 12px;
  line-height: 16px;
  height: 20px;
  vertical-align: middle;
}

.body-cell {
  display: table-cell;
  padding: 0 3px;
  height: 40px;
  color: #000;
  font-size: 14px;
  line-height: 20px;
  vertical-align: middle;
  border-top: 1px solid #e3e5e6;
  border-bottom: 1px solid #e3e5e6;
  position: relative;

  & + & {
    border-left: 1px solid #e3e5e6;
  }

  &._from {
    width: 31%;
    cursor: pointer;
  }
  &._switch {
    width: 40px;
    padding: 0;
  }
  &._to {
    width: 31%;
    padding-left: 12px;
    cursor: pointer;
  }
  &._equal {
    width: 40px;
    position: relative;
    padding: 0;
  }
  &._result {
    width: 31%;
    text-align: center;
  }
}

.button {
  width: 38px;
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;

  &._active {
    cursor: pointer;

    & > svg {
      transition: fill 0.2s ease-out;
    }

    &:hover {
      & > svg {
        fill: #3d7bf5;
      }
    }
  }
}

.dropdown {
  top: calc(100% + 4px);
}
</style>
