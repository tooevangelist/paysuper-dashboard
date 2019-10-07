<script>
import { mapGetters } from 'vuex';
import EntityManagementModal from '@/components/EntityManagementModal.vue';

export default {
  name: 'UiCurrenciesMainHub',

  components: {
    EntityManagementModal,
  },

  model: {
    prop: 'currencies',
    event: 'change',
  },

  props: {
    currencies: {
      type: Array,
      default: () => ['USD'],
    },
  },

  data() {
    return {
      defaultOptionCode: 'USD',
      isToReopenAddModal: false,
      isEntityManagementModalOpened: false,
      localizationsModalCurrencies: [],
      isDeleteModalOpened: false,
      currencyToDelete: '',
    };
  },

  computed: {
    ...mapGetters('Dictionaries', ['currenciesWithRegions']),

    selectOptions() {
      const result = this.currenciesWithRegions.map((item) => {
        if (item.currency === item.region) {
          return {
            code: item.currency,
            label: `${this.$t(`currencies.${item.currency}`)} (${item.currency})`,
          };
        }
        return {
          code: `${item.currency}-${item.region}`,
          label: `${this.$t(`currencies.${item.currency}`)} ${item.region} (${item.currency})`,
        };
      });
      return [
        {
          code: 'USD',
          label: 'American Dollar (USD)',
        },
        ...result,
      ];
    },
  },

  methods: {
    openEntityManagementModal() {
      this.localizationsModalCurrencies = this.currencies.slice();
      this.isEntityManagementModalOpened = true;
    },

    requestDeleteCurrency(currency) {
      if (currency === this.defaultOptionCode) {
        return;
      }
      this.isDeleteModalOpened = true;
      this.currencyToDelete = currency;
    },

    requestDeleteCurrencyFromModal(currency) {
      this.currencyToDelete = currency;
      this.isEntityManagementModalOpened = false;
      this.isToReopenAddModal = true;
      this.isDeleteModalOpened = true;
    },

    deleteCurrency() {
      this.isDeleteModalOpened = false;

      if (this.isToReopenAddModal) {
        this.isEntityManagementModalOpened = true;
        this.isToReopenAddModal = false;
        const newCurrencies = this.localizationsModalCurrencies
          .filter(item => this.currencyToDelete !== item);
        this.localizationsModalCurrencies = newCurrencies;
      } else {
        const newCurrencies = this.currencies.filter(item => this.currencyToDelete !== item);
        this.$emit('change', newCurrencies);
      }
    },

    handleModalSave(newCurrencies) {
      this.$emit('change', newCurrencies);
      this.isEntityManagementModalOpened = false;
    },
  },
};
</script>

<template>
<div>
  <UiEntityMainHub
    label="Currencies"
    :value="currencies"
    :defaultOption="defaultOptionCode"
    @add="openEntityManagementModal"
    @delete="requestDeleteCurrency"
  />

  <UiDeleteModal
    v-if="isDeleteModalOpened"
    title="Delete currency"
    closeButtonText="Cancel"
    @close="isDeleteModalOpened = false"
    @submit="deleteCurrency"
  >
    Are you sure you want to delete? All values for this currency will be lost.
  </UiDeleteModal>

  <EntityManagementModal
    v-if="isEntityManagementModalOpened"
    v-model="localizationsModalCurrencies"
    title="Select currencies"
    :value="currencies"
    :options="selectOptions"
    :defaultOptionCode="defaultOptionCode"
    @close="isEntityManagementModalOpened = false"
    @delete="requestDeleteCurrencyFromModal"
    @save="handleModalSave"
  />
</div>
</template>
