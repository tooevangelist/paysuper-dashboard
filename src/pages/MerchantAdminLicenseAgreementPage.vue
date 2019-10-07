<script>
import { mapState, mapActions } from 'vuex';
import MerchantLicenseAgreementStore from '@/store/MerchantLicenseAgreementStore';
import PictureLicensePage from '@/components/PictureLicensePage.vue';
import MerchantAdminLicenseAgreement from '@/components/MerchantAdminLicenseAgreement.vue';
import getStatusByKey from '@/helpers/getStatusByKey';
import getStatusKey from '@/helpers/getStatusKey';
import { showSuccessMessage } from '@/helpers/notifications';

export default {
  name: 'MerchantLicenseAgreementPage',
  components: {
    PictureLicensePage,
    MerchantAdminLicenseAgreement,
  },
  async asyncData({ store, registerStoreModule, route }) {
    try {
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
    ...mapState('Merchant', ['merchant']),
    ...mapState('MerchantLicenseAgreement', ['agreement']),

    status() {
      return getStatusKey(this.merchant.status);
    },
  },
  mounted() {
    this.initHellosign();
  },
  methods: {
    ...mapActions('Merchant', ['changeMerchantStatus', 'sendNotification']),
    ...mapActions('MerchantLicenseAgreement', ['uploadDocument', 'openLicense', 'initHellosign']),

    async sendMessage(message) {
      const success = await this.sendNotification({
        title: 'Message from PaySuper',
        message,
      });

      if (success) {
        showSuccessMessage('Message was sent', { position: 'bottom-center' });
      }
    },
    async changeStatus({ status, message }) {
      const success = await this.changeMerchantStatus({
        status: getStatusByKey(status),
        message,
      });

      if (success) {
        showSuccessMessage('Status changed', { position: 'bottom-center' });
      }
    },
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
    :merchantStatus="status"
    @sendMessage="sendMessage"
    @changeStatus="changeStatus"
    @openLicense="openLicense"
    @uploadDocument="uploadDocument"
  />
</div>
</template>
