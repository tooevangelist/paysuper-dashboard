<script>
export default {
  name: 'AccountInfo',
  data() {
    return {
      legalName: '',
      website: '',
      operatingName: '',
      country: '',
      region: '',
      city: '',
      zip: '',
      address1: '',
      address2: '',
    };
  },
  computed: {
    isFieldsValid() {
      if (
        !legalName ||
        !website ||
        !country ||
        !city ||
        !zip ||
        !address1
      ) {
        return false;
      }

      return true;
    },
  },
  methods: {
    submit() {
      if (this.isFieldsValid) {
        this.$emit('accountInfoSubmit');
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
      label="Legal name"
      :required="true"
      :value="legalName"
      @input="legalName = $event"
    />
    <UiTextField
      label="Website"
      :required="true"
      :value="website"
      @input="website = $event"
    />
    <UiTextField
      label="Operating name"
      :value="operatingName"
      @input="operatingName = $event"
    />
  </div>

  <div class="section">
    <div class="title">Location</div>
    <div class="info">
      Notice your company correct location address here.
      Since this information will be mentioned in official documentation between us
      it must be corresponded with your official registrational data.
    </div>

    <UiTextField
      label="Country"
      :required="true"
      :value="country"
      @input="country = $event"
    />
    <UiTextField
      label="State / Province / Region"
      :value="region"
      @input="region = $event"
    />
    <UiTextField
      label="City"
      :required="true"
      :value="city"
      @input="city = $event"
    />
    <UiTextField
      label="Zip Code"
      :required="true"
      :value="zip"
      @input="zip = $event"
    />
    <UiTextField
      label="Address 1"
      :required="true"
      :value="address1"
      @input="address1 = $event"
    />
    <UiTextField
      label="Address 2"
      :value="address2"
      @input="address2 = $event"
    />
  </div>

  <UiButton
    class="submit"
    :disabled="!isFieldsValid"
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
</style>
