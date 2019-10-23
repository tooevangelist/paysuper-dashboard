<script>
import { mapActions, mapState } from 'vuex';
import { format } from 'date-fns';
import moment from 'moment';
import ReportCardStore from '@/store/ReportCardStore';

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
  },

  data() {
    return {
      colors: STATUS_COLOR,
      showRefundModal: false,
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
  },
};
</script>

<template>
  <div>
    <UiPageHeaderFrame class="report-page-header">
      <template slot="title">
        Royal report {{ report.id }}
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
    <div class="report-buttons">
      <span>
        <UiButton
          size="default"
          :isTransparent="true"
          @click="true"
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
          @click="true"
          >
          <IconDispute slot="iconBefore" />
          Dispute
        </UiButton>
      </span>
    </div>
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
