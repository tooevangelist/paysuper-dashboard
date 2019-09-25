<script>
import { mapGetters } from 'vuex';
import AgreementProgressWidget from '@/components/AgreementProgressWidget.vue';
import Charts from '@/components/Charts.vue';
import DashboardStore from '@/store/DashboardStore';

export default {
  name: 'Dashboard',
  components: {
    AgreementProgressWidget,
    Charts,
  },
  async asyncData({ store, registerStoreModule }) {
    try {
      await registerStoreModule('Dashboard', DashboardStore);
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },
  computed: {
    ...mapGetters('User/Merchant', ['isOnboardingComplete']),
  },
};
</script>

<template>
<div>
  <AgreementProgressWidget v-if="!isOnboardingComplete" />
  <Charts v-if="isOnboardingComplete" />
</div>
</template>
