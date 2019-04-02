<script>
import { mapGetters } from 'vuex';
import { filter } from 'lodash-es';
import MerchantFormBasicInfo from '@/components/MerchantFormBasicInfo.vue';
import MerchantFormContacts from '@/components/MerchantFormContacts.vue';
import MerchantFormBankingInfo from '@/components/MerchantFormBankingInfo.vue';

export default {
  name: 'MerchantFormCompanyInfo',

  components: {
    MerchantFormBasicInfo,
    MerchantFormContacts,
    MerchantFormBankingInfo,
  },

  props: {
    merchant: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      forms: {
        basicInfo: {
          label: 'Basic info',
          status: 'initial',
          component: 'MerchantFormBasicInfo',
          isValidable: true,
        },
        contacts: {
          label: 'Contacts',
          status: 'initial',
          component: 'MerchantFormContacts',
          isValidable: true,
        },
        bankingInfo: {
          label: 'Banking info',
          status: 'initial',
          component: 'MerchantFormBankingInfo',
          isValidable: true,
        },
      },
    };
  },

  computed: {
    ...mapGetters('Dictionaries', ['countriesTwoLetters']),
    isFormValid() {
      return !filter(this.forms, item => item.status !== 'complete' && item.isValidable).length;
    },
  },


  methods: {
    validateForm() {
      this.$refs.forms.forEach((form) => {
        if (form.validateForm) {
          form.validateForm();
        }
      });
    },
    chekIfFormValid() {
      this.$refs.forms.forEach((form) => {
        if (form.validateForm) {
          form.validateForm();
        }
      });
      return this.isFormValid;
    },

    handleValidationResult(formName, isValid) {
      this.forms[formName].status = isValid ? 'complete' : 'incomplete';
      this.$emit('validationResult', this.isFormValid);
    },
  },
};
</script>

<template>
  <div class="merchant-admin-form-basic-info">
    <component
      class="merchant-admin-form-basic-info__form"
      v-for="(form, formName) in forms"
      :is="form.component"
      :merchant="merchant"
      :key="formName"
      ref="forms"
      @validationResult="handleValidationResult(formName, $event)"
    />
  </div>
</template>

<style lang="scss" scoped>
.merchant-admin-form-basic-info {
  // width: 528px;

  &__form {
    & + & {
      margin-top: 30px;
    }
  }
}
</style>
