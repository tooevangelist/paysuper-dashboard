<script>
import { mapState, mapActions } from 'vuex';
import {
  UiButton, UiPageHeader,
} from '@protocol-one/ui-kit';
import MerchantStore from '@/store/MerchantStore';

export default {
  components: {
    UiPageHeader,
    UiButton,
  },

  asyncData({ registerStoreModule, route }) {
    return registerStoreModule('Merchant', MerchantStore, {
      query: route.query,
    });
  },

  data() {
    return {

    };
  },
  computed: {
    ...mapState('Merchant', ['merchant']),
  },


  methods: {
    ...mapActions('Merchant', ['updateMerchant']),
    update() {
      this.updateMerchant({
        ...this.data,
        name: this.name,
        currency: this.currency,
        country: this.country,
        accounting_period: this.accountingPeriod,
      });
    },
  },
};
</script>

<template>
  <div>
    <UiPageHeader>
      <span slot="title">Merchants list</span>
      <UiButton slot="right">Save</UiButton>
    </UiPageHeader>
  </div>
</template>
