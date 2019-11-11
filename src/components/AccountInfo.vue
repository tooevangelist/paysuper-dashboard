<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { get } from 'lodash-es';
import { maxLength, required, url } from 'vuelidate/lib/validators';
import { onlyRusAndLat, onlyRusAndLatAndNum } from '@/helpers/customValidators';
import Notifications from '@/mixins/Notifications';

export default {
  name: 'AccountInfo',
  mixins: [Notifications],
  validations: {
    accountInfo: {
      address: { maxLength: maxLength(100), required },
      addressAdditional: { maxLength: maxLength(100) },
      alternativeName: { onlyRusAndLat, maxLength: maxLength(60), required },
      city: { required },
      country: { required },
      name: { onlyRusAndLat, maxLength: maxLength(60), required },
      registrationNumber: { onlyRusAndLatAndNum, maxLength: maxLength(20), required },
      state: { onlyRusAndLatAndNum },
      taxId: { onlyRusAndLatAndNum, maxLength: maxLength(20) },
      website: { required, url },
      zip: { maxLength: maxLength(30), required },
    },
  },

  computed: {
    ...mapGetters('Dictionaries', ['countries']),
    ...mapGetters('Company/AccountInfo', ['accountInfo', 'cities']),
    ...mapState('User/Merchant', ['merchant']),

    status() {
      return this.merchant.status;
    },
    // Cities must be into Dictionaries store
    preparedCities() {
      return this.cities.map(city => ({ label: city, value: city }));
    },
  },
  async mounted() {
    try {
      await this.initState();
    } catch (error) {
      this.$_Notifications_showErrorMessage(error);
    }
  },
  methods: {
    ...mapActions('Company/AccountInfo', ['initState', 'updateAccountInfo', 'submitAccountInfo']),

    updateField(key, value) {
      this.updateAccountInfo({ ...this.accountInfo, [key]: value });
    },

    async submit() {
      this.$v.accountInfo.$touch();
      if (!this.$v.accountInfo.$invalid) {
        try {
          const hasSubmit = await this.submitAccountInfo();

          if (hasSubmit) {
            this.$emit('hasSubmit');
          }
        } catch (error) {
          this.$_Notifications_showErrorMessage(get(error, 'response.data.details'));
        }
      }
    },
  },
};
</script>

<template>
<div class="account-info">
  <div class="section">
    <div class="title">Identification</div>
    <div class="info">
      Provide your official and public company names as well as your official site WEB address,
      so we could understand your company is related to a video games industry.
    </div>

    <UiTextField
      v-bind="$getValidatedFieldProps('accountInfo.name')"
      label="Legal name"
      :value="accountInfo.name"
      @input="updateField('name', $event)"
      @blur="$v.accountInfo.name.$touch()"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('accountInfo.website')"
      label="Website"
      :value="accountInfo.website"
      :autocompleteUrlProtocol="true"
      @input="updateField('website', $event)"
      @blur="$v.accountInfo.website.$touch()"
      />
    <UiTextField
      v-bind="$getValidatedFieldProps('accountInfo.alternativeName')"
      label="Operating name"
      :value="accountInfo.alternativeName"
      @input="updateField('alternativeName', $event)"
      @blur="$v.accountInfo.alternativeName.$touch()"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('accountInfo.registrationNumber')"
      label="Registration number"
      :value="accountInfo.registrationNumber"
      @input="updateField('registrationNumber', $event)"
      @blur="$v.accountInfo.registrationNumber.$touch()"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('accountInfo.taxId')"
      label="VAT number (EU)"
      :value="accountInfo.taxId"
      :required="false"
      @input="updateField('taxId', $event)"
      @blur="$v.accountInfo.taxId.$touch()"
    />
  </div>

  <div class="section">
    <div class="title">Location</div>
    <div class="info">
      Notice your company correct location address here.
      Since this information will be mentioned in official documentation between us
      it must be corresponded with your official registrational data.
    </div>

    <UiSelect
      v-bind="$getValidatedFieldProps('accountInfo.country')"
      label="Country"
      :options="countries"
      :value="accountInfo.country"
      @input="updateField('country', $event)"
      @blur="$v.accountInfo.country.$touch()"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('accountInfo.state')"
      label="State / Province / Region"
      :value="accountInfo.state"
      :required="false"
      @input="updateField('state', $event)"
      @blur="$v.accountInfo.state.$touch()"
    />
    <UiSelect
      v-bind="$getValidatedFieldProps('accountInfo.city')"
      label="City"
      :options="preparedCities"
      :value="accountInfo.city"
      @input="updateField('city', $event)"
      @blur="$v.accountInfo.city.$touch()"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('accountInfo.zip')"
      label="Zip Code"
      :value="accountInfo.zip"
      @input="updateField('zip', $event)"
      @blur="$v.accountInfo.zip.$touch()"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('accountInfo.address')"
      label="Address 1"
      :value="accountInfo.address"
      @input="updateField('address', $event)"
      @blur="$v.accountInfo.address.$touch()"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('accountInfo.addressAdditional')"
      label="Address 2"
      :value="accountInfo.addressAdditional"
      :required="false"
      @input="updateField('addressAdditional', $event)"
      @blur="$v.accountInfo.addressAdditional.$touch()"
    />
  </div>

  <UiButton
    class="submit"
    :disabled="$v.accountInfo.$invalid || status !== 0"
    @click="submit"
  >
    SUBMIT INFO
  </UiButton>
</div>
</template>

<style lang="scss" scoped>
.account-info {
  display: flex;
  flex-direction: column;
}
.section {
  margin-bottom: 12px;
}
.title {
  font-family: Quicksand;
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  letter-spacing: 0.15px;
  color: #000;
  margin-bottom: 8px;
}
.info {
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.25px;
  color: #5e6366;
  margin-bottom: 20px;
  max-width: 548px;
}
.submit {
  min-width: 180px;
  align-self: flex-end;
  letter-spacing: 0.75px;
}
</style>
