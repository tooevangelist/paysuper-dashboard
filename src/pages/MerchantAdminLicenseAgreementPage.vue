<script>
import { mapState, mapActions } from 'vuex';
import { get, findKey } from 'lodash-es';
import MerchantLicenseAgreementStore from '@/store/MerchantLicenseAgreementStore';
import PictureExcellentWork from '@/components/PictureExcellentWork.vue';
import PictureLicensePage from '@/components/PictureLicensePage.vue';
import MerchantAdminLicenseAgreement from '@/components/MerchantAdminLicenseAgreement.vue';
import merchantStatusScheme from '@/schemes/merchantStatusScheme';
import { showSuccessMessage } from '@/helpers/notifications';

export default {
  name: 'MerchantLicenseAgreementPage',
  components: {
    PictureExcellentWork,
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
  data() {
    return {
      hasSigned: false,
    };
  },
  computed: {
    ...mapState('Merchant', ['merchant']),
    ...mapState('MerchantLicenseAgreement', ['agreement']),

    status() {
      return get(merchantStatusScheme, this.merchant.status, merchantStatusScheme[0]).value;
    },
    hasSignature() {
      return this.merchant.has_merchant_signature || false;
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
        status: findKey(merchantStatusScheme, { value: status }),
        message,
      });

      if (success) {
        showSuccessMessage('Status changed', { position: 'bottom-center' });

        if (status === 'signed') {
          this.hasSigned = true;
        }
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
    :hasSignature="hasSignature"
    @sendMessage="sendMessage"
    @changeStatus="changeStatus"
    @openLicense="openLicense"
    @uploadDocument="uploadDocument"
  />

  <UiModal
    v-if="hasSigned"
    width="448px"
  >
    <PictureExcellentWork />
    <UiHeader
      slot="header"
      level="3"
      align="center"
      :hasMargin="true"
    >
      Excellent work!
    </UiHeader>
    <div class="modal-content">
      Now agreement is signed by both sides and this company's request moved to a Merchants list.
    </div>
    <div class="modal-controls">
      <UiButton @click="hasSigned = false">DONE</UiButton>
    </div>
  </UiModal>
</div>
</template>

<style lang="scss" scoped>
.modal-content {
  font-family: Roboto;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.25px;
  color: #5e6366;
  text-align: center;
  margin-bottom: 24px;
}
.modal-controls {
  display: flex;
  justify-content: center;
}
</style>
