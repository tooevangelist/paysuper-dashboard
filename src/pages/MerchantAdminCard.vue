<script>
import MerchantStore from '@/store/MerchantStore';

export default {
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
