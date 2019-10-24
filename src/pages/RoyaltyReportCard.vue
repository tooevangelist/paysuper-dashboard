<script>
import { mapActions, mapState } from 'vuex';
import { format } from 'date-fns';
import moment from 'moment';
import {
  get,
} from 'lodash-es';
import ReportCardStore from '@/store/ReportCardStore';
import ReportDispute from '@/components/ReportDispute.vue';

const STATUS_COLOR = {
  pending: 'orange',
  accepted: 'green',
  waiting_payment: 'green',
  paid: 'aqua',
  dispute: 'red',
  canceled: 'transparent',
};

const STATUS = {
  pending: 'pending',
  accepted: 'confirmed',
  waiting_payment: 'paying',
  paid: 'paid',
  dispute: 'dispute',
  canceled: 'canceled',
};

export default {
  name: 'RoyaltyReportCard',
  components: {
    ReportDispute,
  },

  data() {
    return {
      colors: STATUS_COLOR,
      showDisputeModal: false,
      reportTabs: [
        { label: 'Summary', value: 'sum' },
        { label: 'Transactions report', value: 'trans' },
      ],
      currentTab: 0,
    };
  },

  async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('ReportCard', ReportCardStore, {
        reportId: route.params.reportId,
      }).catch(this.$showErrorMessage);
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },

  computed: {
    ...mapState('ReportCard', ['report']),
  },

  methods: {
    ...mapActions(['setIsLoading']),
    ...mapActions('ReportCard', [
      'acceptReport',
      'dispute',
    ]),

    formatDateAndTime(seconds) {
      const datetime = new Date(seconds * 1000);
      return format(datetime, 'dd.MM.yyyy, HH:mm:ss');
    },

    getStatus(status) {
      return STATUS[status];
    },

    getFormattedDate(item) {
      return moment.unix(item).format('DD MMM YYYY');
    },

    async confirmReport() {
      this.setIsLoading(true);
      await this.acceptReport()
        .then(this.$showSuccessMessage('Report confirmed'))
        .catch(this.$showErrorMessage);
      this.setIsLoading(false);
    },

    openDispute() {
      this.showDisputeModal = true;
    },

    async declineReport(reason) {
      this.setIsLoading(true);
      this.showDisputeModal = false;
      await this.dispute(reason)
        .catch(this.$showErrorMessage);
      this.setIsLoading(false);
    },

    getValue(item, path) {
      return get(item, path) || '—';
    },

    returnColorAmount(status) {
      return status === 'paid' ? '#069697' : '#3E4345';
    },
  },
};
</script>

<template>
  <div>
    <UiPageHeaderFrame class="report-page-header">
      <template slot="title">
        Royalty report {{ report.id }}
      </template>
      <span slot="description">
        <div class="header-date">
          <span>
            <IconDate/>
          </span>
          <span>
            {{ getFormattedDate(report.period_from.seconds) }}
            —
            {{ getFormattedDate(report.period_to.seconds) }}
          </span>
        </div>
         <UiLabelTag class="status" :color="colors[report.status]">
          {{ getStatus(report.status) }}
        </UiLabelTag>
      </span>
    </UiPageHeaderFrame>
    <div class="report-buttons" v-if="report.status === 'pending'">
      <span>
        <UiButton
          size="default"
          :isTransparent="true"
          @click="confirmReport"
          >
          <IconCheckInCircle slot="iconBefore" />
          Confirm
        </UiButton>
      </span>
      <span>
        <UiButton
          size="default"
          :color="`transparent-gray`"
          :isTransparent="true"
          @click="openDispute"
          >
          <IconDispute slot="iconBefore" />
          Dispute
        </UiButton>
      </span>
    </div>

    <UiTabs
      class="tabs"
      :items="reportTabs"
      v-model="currentTab">
    </UiTabs>

    <UiPanel>
      <UiTable v-if="currentTab === 0">
        <UiTableRow :isHead="true">
          <UiTableCell align="left">Period</UiTableCell>
          <UiTableCell align="left">Report date</UiTableCell>
          <UiTableCell align="left">Payout ID</UiTableCell>
          <UiTableCell align="left">Payment date</UiTableCell>
          <UiTableCell align="left">Amount</UiTableCell>
          <UiTableCell align="left">Status</UiTableCell>
          <UiTableCell align="left" width="3%"></UiTableCell>
        </UiTableRow>
        <UiTableRow
          class="report"
          >
          <UiTableCell align="left">
            {{ getFormattedDate(report.period_from.seconds) }}
            —
            {{ getFormattedDate(report.period_to.seconds) }}
          </UiTableCell>
          <UiTableCell align="left">
            {{ getFormattedDate(report.created_at.seconds) }}
          </UiTableCell>
          <UiTableCell align="left">
            {{ getValue(report, 'payout_document_id') }}
          </UiTableCell>
          <UiTableCell align="left">
            {{ getFormattedDate(report.payout_date.seconds) }}
          </UiTableCell>
          <UiTableCell align="left" :style="{ color: returnColorAmount(report.status) }">
            {{
            report.totals !== null && report.currency && report.totals.payout_amount
            ? $formatPrice(report.totals.payout_amount, report.currency)
            : '—'
            }}
          </UiTableCell>
          <UiTableCell/>
        </UiTableRow>
      </UiTable>
    </UiPanel>

    <ReportDispute
      :showModal="showDisputeModal"
      @close="showDisputeModal = false"
      @input="declineReport($event)"></ReportDispute>
  </div>
</template>

<style lang="scss" scoped>
.report-page-header{
  position: relative;
}

.status {
  text-transform: capitalize;
}

.header-date {
  display: flex;
  align-items: center;
  justify-content: flex-start;

  margin-bottom: 10px;
  & span {
    margin-right: 10px;

    & svg {
      position: relative;
      top: 2px;
    }
  }
}

.report-buttons {
  width: 100%;
  margin: 20px 0;

  display: flex;
  align-items: center;

  & span {
    width: 50%;
    &:first-child {
      margin-right: 8px;
      & button svg {
        fill: #3D7BF5;
      }
    }
    & button {
      width: 100%;
    }
  }
}
</style>
