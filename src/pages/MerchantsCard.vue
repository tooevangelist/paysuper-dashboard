<script>
import Notifications from '@/mixins/Notifications';
import MerchantStore from '@/store/MerchantStore';

export default {
  mixins: [Notifications],

  async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('Merchant', MerchantStore, route.params.id);
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },
};
</script>

<template>
  <RouterView></RouterView>
</template>
