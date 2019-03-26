<script>
import Notifications from '@/mixins/Notifications';
import MerchantStore from '@/store/MerchantStore';

export default {
  mixins: [Notifications],

  asyncData({ registerStoreModule, route }) {
    return registerStoreModule('Merchant', MerchantStore, route.params.id);
  },
};
</script>

<template>
  <RouterView></RouterView>
</template>
