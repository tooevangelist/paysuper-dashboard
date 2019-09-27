<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import MerchantLicenseAgreementStore from '@/store/MerchantLicenseAgreementStore';
import MerchantProfileStore from '@/store/MerchantProfileStore';
import PictureLicensePage from '@/components/PictureLicensePage.vue';
import MerchantAdminLicenseAgreement from '@/components/MerchantAdminLicenseAgreement.vue';
import { toggleSort, getSortDirection } from '@/helpers/handleSort';

export default {
  name: 'MerchantLicenseAgreementPage',
  components: {
    PictureLicensePage,
    MerchantAdminLicenseAgreement,
  },
  async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('MerchantProfile', MerchantProfileStore, route.params.id);
      await registerStoreModule(
        'MerchantLicenseAgreement',
        MerchantLicenseAgreementStore,
        route.params.id,
      );
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },
  computed: {
    ...mapState('MerchantLicenseAgreement', ['agreement', 'document', 'status']),
  },
  methods: {
    ...mapActions('MerchantLicenseAgreement', [
      'initLicense',
      'uploadDocument',
      'openLicense',
      'changeStatus',
    ]),
  },
};
</script>

<template>
<div>
  <UiPageHeaderFrame>
    <span slot="title">License Agreement</span>
    <span slot="description">
      This is the main screen for merchant onboarding process.
      Here you will control the whole procedure, check statuses,
      lead communications and work with agreement documentation.
    </span>
    <PictureLicensePage slot="picture" />
  </UiPageHeaderFrame>

  <MerchantAdminLicenseAgreement
    :agreement="agreement"
    :document="document"
    :status="status"
    @changeStatus="changeStatus"
    @openLicense="openLicense"
    @uploadDocument="uploadDocument"
  />
</div>
</template>
