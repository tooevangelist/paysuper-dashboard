<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { get, debounce } from 'lodash-es';
import { maxLength, required, url } from 'vuelidate/lib/validators';
import { onlyRusAndLat, onlyRusAndLatAndNum } from '@/helpers/customValidators';

export default {
  name: 'AccountInfo',
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

  data() {
    return {
      isLoadingAutocomplete: true,
      isLoadingCities: false,
      countryQuery: '',
      countryCode: '',
    };
  },

  computed: {
    ...mapGetters('Dictionaries', ['countries', 'cities']),
    ...mapGetters('Company/AccountInfo', ['accountInfo']),
    ...mapState('User/Merchant', ['merchant']),
    ...mapGetters('User', ['userPermissions']),

    viewOnly() {
      return !this.userPermissions.editCompany || this.status !== 0;
    },

    status() {
      return this.merchant.status;
    },

    filteredCountries() {
      return this.countries
        .filter(c => c.label.toLowerCase().indexOf(this.countryQuery.toLowerCase()) > -1);
    },

    country: {
      get() {
        const country = this.countries.find(c => c.value === this.countryCode);
        return country === undefined ? '' : country.label;
      },
      set(value) {
        this.updateCountry(value);
      },
    },
  },

  async mounted() {
    try {
      await this.initState();
    } catch (error) {
      this.$showErrorMessage(error);
    }
    this.countryCode = this.accountInfo.country;
  },
  methods: {
    ...mapActions('Company/AccountInfo', ['initState', 'updateAccountInfo', 'submitAccountInfo']),
    ...mapActions('Dictionaries', ['fetchCities']),

    updateField(key, value) {
      this.updateAccountInfo({ ...this.accountInfo, [key]: value });
    },

    // eslint-disable-next-line
    handleAutocompeteInput: debounce(async function (value) {
      this.isLoadingCities = true;
      await this.fetchCities({ query: value, country: this.countryCode });
      this.isLoadingCities = false;
    }, 500),

    handleCountryInput(value) {
      this.countryQuery = value;
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
          this.$showErrorMessage(get(error, 'response.data.details'));
        }
      }
    },

    handleUpdateCountry(value) {
      this.country = value;
    },

    updateCountry(value) {
      if (this.countries.find(c => c.value === value) !== undefined) {
        this.accountInfo.country = value;
        this.countryCode = value;
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
      :disabled="viewOnly"
      @input="updateField('name', $event)"
      @blur="$v.accountInfo.name.$touch()"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('accountInfo.website')"
      label="Website"
      :value="accountInfo.website"
      :autocompleteUrlProtocol="true"
      :disabled="viewOnly"
      @input="updateField('website', $event)"
      @blur="$v.accountInfo.website.$touch()"
      />
    <UiTextField
      v-bind="$getValidatedFieldProps('accountInfo.alternativeName')"
      label="Operating name"
      :value="accountInfo.alternativeName"
      :disabled="viewOnly"
      @input="updateField('alternativeName', $event)"
      @blur="$v.accountInfo.alternativeName.$touch()"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('accountInfo.registrationNumber')"
      label="Registration number"
      :value="accountInfo.registrationNumber"
      :disabled="viewOnly"
      @input="updateField('registrationNumber', $event)"
      @blur="$v.accountInfo.registrationNumber.$touch()"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('accountInfo.taxId')"
      label="VAT number (EU)"
      :value="accountInfo.taxId"
      :required="false"
      :disabled="viewOnly"
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

    <UiAutocomplete
      v-bind="$getValidatedFieldProps('accountInfo.country')"
      label="Country"
      v-model="country"
      :required="true"
      @query="handleCountryInput"
      @input="handleUpdateCountry"
      @blur="$v.accountInfo.country.$touch()"
      :resultsAutocomplete="filteredCountries"
      :disabled="viewOnly"
      :threshold="0"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('accountInfo.state')"
      label="State / Province / Region"
      :value="accountInfo.state"
      :required="false"
      :disabled="viewOnly"
      @input="updateField('state', $event)"
      @blur="$v.accountInfo.state.$touch()"
    />
    <UiAutocomplete
      v-bind="$getValidatedFieldProps('accountInfo.city')"
      label="City"
      v-model="accountInfo.city"
      :required="true"
      @query="handleAutocompeteInput"
      @input="updateField('city', $event)"
      @blur="$v.accountInfo.city.$touch()"
      :resultsAutocomplete="cities"
      :isLoading="isLoadingCities"
      :disabled="viewOnly || !accountInfo.country"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('accountInfo.zip')"
      label="Zip Code"
      :value="accountInfo.zip"
      :disabled="viewOnly"
      @input="updateField('zip', $event)"
      @blur="$v.accountInfo.zip.$touch()"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('accountInfo.address')"
      label="Address 1"
      :value="accountInfo.address"
      :disabled="viewOnly"
      @input="updateField('address', $event)"
      @blur="$v.accountInfo.address.$touch()"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('accountInfo.addressAdditional')"
      label="Address 2"
      :value="accountInfo.addressAdditional"
      :required="false"
      :disabled="viewOnly"
      @input="updateField('addressAdditional', $event)"
      @blur="$v.accountInfo.addressAdditional.$touch()"
    />
  </div>

  <UiButton
    v-if="!viewOnly"
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
