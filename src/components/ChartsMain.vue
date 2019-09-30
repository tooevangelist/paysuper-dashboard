<script>
import { merge } from 'lodash-es';
import Barchart from '@/components/Barchart.vue';
import getBarchartOptionsByType from '@/helpers/getBarchartOptionsByType';

export default {
  name: 'ChartsMain',
  components: { Barchart },
  props: {
    chartPeriod: {
      default: () => ({}),
      type: Object,
    },
    currency: {
      default: 'USD',
      type: String,
    },
    data: {
      default: () => ({}),
      type: Object,
    },
  },
  computed: {
    chartOptions() {
      return merge(
        getBarchartOptionsByType('common'),
        {
          scales: { xAxes: [{ time: { ...this.chartPeriod } }] },
          tooltips: { callbacks: { label: ({ yLabel }) => `${yLabel} ${this.currency}` } },
        },
      );
    },
  },
};
</script>

<template>
<div class="charts-main">
  <div class="section">
    <div class="box _main">
      <div class="value">
        {{ data.gross_revenue.amount }} {{ currency }}
        <IconArrowBold
          v-if="data.gross_revenue.hasIncreasedArrow"
          :class="['arrow', { '_is-decreased': !data.gross_revenue.isIncreased }]"
        />
      </div>
      <div class="additional">Gross revenue</div>
      <Barchart
        v-if="data.gross_revenue.hasChart"
        class="chart"
        :data="data.gross_revenue.chart"
        :options="chartOptions"
      />
    </div>
    <div class="box _main">
      <div class="value">
        {{ data.total_transactions.amount }} {{ currency }}
        <IconArrowBold
          v-if="data.total_transactions.hasIncreasedArrow"
          :class="['arrow', { '_is-decreased': !data.total_transactions.isIncreased }]"
        />
      </div>
      <div class="additional">Total transactions</div>
      <Barchart
        v-if="data.total_transactions.hasChart"
        class="chart"
        :data="data.total_transactions.chart"
        :options="chartOptions"
      />
    </div>
    <div class="box _main">
      <div class="value">
        {{ data.arpu.amount }} {{ currency }}
        <IconArrowBold
          v-if="data.arpu.hasIncreasedArrow"
          :class="['arrow', { '_is-decreased': !data.arpu.isIncreased }]"
        />
      </div>
      <div class="additional">ARPU</div>
      <Barchart
        v-if="data.arpu.hasChart"
        class="chart"
        :data="data.arpu.chart"
        :options="chartOptions"
      />
    </div>
    <div class="box _main">
      <div class="value">
        {{ data.vat.amount }} {{ currency }}
        <IconArrowBold
          v-if="data.vat.hasIncreasedArrow"
          :class="['arrow', { '_is-decreased': !data.vat.isIncreased }]"
        />
      </div>
      <div class="additional">VAT</div>
      <Barchart
        v-if="data.vat.hasChart"
        class="chart"
        :data="data.vat.chart"
        :options="chartOptions"
      />
    </div>
  </div>
</div>
</template>

<style lang="scss" scoped>
.charts-main {
  display: flex;
  flex-direction: column;
}
.section {
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 8px;
}
.box {
  display: flex;
  justify-content: space-between;
  flex-basis: 100%;
  background-color: #fff;
  box-shadow: 0px 1px 2px rgba(8, 35, 48, 0.24), 0px 2px 6px rgba(8, 35, 48, 0.16);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;

  &._payout {
    padding-bottom: 36px;
    text-align: right;

    @media screen and (min-width: 768px) {
      flex-basis: calc(50% - 8px);
    }
  }
  &._main {
    max-height: 160px;

    @media screen and (min-width: 768px) {
      flex-basis: calc(50% - 8px);
    }
    @media screen and (min-width: 1170px) {
      flex-basis: calc(25% - 12px);
    }

    & > .value,
    & > .additional {
      flex-basis: 100%;
      white-space: nowrap;
    }
    & > .value {
      margin-bottom: 8px;
    }
  }
}
.value {
  font-family: Quicksand;
  color: #000;
  font-size: 24px;
  line-height: 30px;
  padding-right: 16px;
  display: flex;
  align-items: center;
}
.arrow {
  margin-left: 10px;

  &._is-decreased {
    fill: #ea3d2f;
    transform: rotate(180deg);
  }
}
.additional {
  color: #919699;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.4px;
}
.chart {
  height: 70px;
}
</style>
