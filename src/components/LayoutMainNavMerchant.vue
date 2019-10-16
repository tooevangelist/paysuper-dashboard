<script>
import { mapActions, mapState } from 'vuex';
import {
  findIndex,
  get,
  includes,
  kebabCase,
  map,
  startCase,
  upperFirst,
} from 'lodash-es';
import LayoutMainNavInnerBase from '@/components/LayoutMainNavInnerBase.vue';
import { showSuccessMessage } from '@/helpers/notifications';
import merchantStatusScheme from '@/schemes/merchantStatusScheme';

function getItemIcon(item) {
  return {
    personalProfile: 'IconProfile',
    companyInfo: 'IconBusinessCase',
    licenseAgreement: 'IconBlank',
    paymentMethods: 'IconMoney',
    history: 'IconSandglass',
  }[item];
}

function getItemAvailable(item, status) {
  return {
    personalProfile: true,
    companyInfo: true,
    licenseAgreement: status !== 5,
    paymentMethods: status !== 5,
    history: true,
  }[item];
}

export default {
  name: 'LayoutMainNavProject',

  components: {
    LayoutMainNavInnerBase,
  },

  data() {
    return {
      isModalOpened: false,
    };
  },

  computed: {
    ...mapState('Merchant', ['merchant']),

    items() {
      const navItems = [
        'personalProfile',
        'companyInfo',
        'licenseAgreement',
        'paymentMethods',
        'history',
      ];

      return map(navItems, item => ({
        title: startCase(item),
        value: item,
        icon: getItemIcon(item),
        url: `/merchants/${this.merchant.id || 'new'}/${kebabCase(item)}/`,
        routeNames: [`MerchantAdmin${upperFirst(item)}`],
        available: getItemAvailable(item, this.status),
      }));
    },

    currentItemIndex() {
      const routeIndex = findIndex(this.items, item => includes(item.routeNames, this.$route.name));
      if (routeIndex !== -1) {
        return routeIndex;
      }
      return findIndex(this.items, { value: this.$route.query.step || 'basicInfo' });
    },

    status() {
      return get(this.merchant, 'status', 0);
    },

    statusKey() {
      return get(merchantStatusScheme, this.status, merchantStatusScheme[0]).value;
    },

    headTitle() {
      return get(this.merchant, 'company.name') || '';
    },
  },

  methods: {
    ...mapActions('Merchant', ['changeMerchantStatus']),

    async submitArchive() {
      const hasChanged = await this.changeMerchantStatus({
        status: 5,
        message: 'Your account has been move to archive',
      });
      this.isModalOpened = false;

      if (hasChanged) {
        showSuccessMessage('Account has been move to archive', { position: 'bottom-center' });
      }
    },
  },
};
</script>

<template>
<div class="merchant-nav">
  <LayoutMainNavInnerBase
    :headTitle="headTitle"
    :headStatus="statusKey"
    :headImage="''"
    :items="items"
    :currentItemIndex="currentItemIndex"
  />

  <div
    v-if="status === 0"
    class="archive-block"
  >
    <UiButton
      size="small"
      :isTransparent="true"
      @click="isModalOpened = true"
    >
      <IconArchive slot="iconBefore" />
      ARCHIVE ACCOUNT
    </UiButton>
  </div>

  <UiModal
    v-if="isModalOpened"
    width="448px"
  >
    <UiHeader
      slot="header"
      level="3"
      align="center"
      :hasMargin="true"
    >
      Archive account
    </UiHeader>
    <div class="modal-content">
      Are you sure you want to archive this request?
    </div>
    <div class="controls">
      <UiButton
        color="gray"
        :isTransparent="true"
        @click="isModalOpened = false"
      >CANCEL</UiButton>
      <UiButton
        color="red"
        @click="submitArchive"
      >ARCHIVE</UiButton>
    </div>
  </UiModal>
</div>
</template>

<style lang="scss" scoped>
.merchant-nav {
  display: flex;
  flex-direction: column;
}
.archive-block {
  margin: 16px 32px;
  padding-top: 24px;
  border-top: 1px solid #f1f3f4;
}
.modal-content {
  text-align: center;
  margin-bottom: 24px;
}
.controls {
  display: flex;

  & > * {
    &:first-child {
      flex-grow: 1;
      margin-right: 16px;
    }

    &:last-child {
      flex-grow: 4;
    }
  }
}
</style>
