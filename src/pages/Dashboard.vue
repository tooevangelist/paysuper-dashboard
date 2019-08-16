<script>
import AgreementProgressWidget from '@/components/AgreementProgressWidget.vue';
import CompanyStore from '@/store/CompanyStore';

export default {
  name: 'Dashboard',
  components: {
    AgreementProgressWidget,
  },
  async asyncData({ store, registerStoreModule }) {
    try {
      await registerStoreModule('Company', CompanyStore);
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },
};
</script>

<template>
<AgreementProgressWidget />
</template>

<style lang="scss" scoped>
</style>
