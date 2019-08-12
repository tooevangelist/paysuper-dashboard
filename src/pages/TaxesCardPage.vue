<script>
import TaxesByCountryStore from '@/store/TaxesByCountryStore';

export default {
  name: 'TaxesCardPage',

  async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('TaxesByCountry', TaxesByCountryStore, {
        id: route.params.id,
        query: route.query,
      });
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },
};
</script>

<template>
  <RouterView></RouterView>
</template>
