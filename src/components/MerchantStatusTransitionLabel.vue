<script>
import merchantStatusScheme from '@/schemes/merchantStatusScheme';
import IconBigArrow from '@/components/IconBigArrow.vue';

export default {
  name: 'MerchantStatusTransitionLabel',

  components: {
    IconBigArrow,
  },

  props: {
    codeFrom: {
      type: Number,
    },
    codeTo: {
      type: Number,
    },
  },

  data() {
    return {
      statuses: merchantStatusScheme,
    };
  },

};
</script>

<template>
  <div
    class="merchant-status-transition-label"
  >
    <UiLabelTag
      v-if="codeFrom !== undefined"
      :color="statuses[codeFrom].color"
      v-text="statuses[codeFrom].text"
    />
    <IconBigArrow class="arrow" />
    <UiLabelTag
      v-if="codeTo !== undefined"
      :color="statuses[codeTo].color"
      v-text="statuses[codeTo].text"
    />
  </div>
</template>

<style lang="scss" scoped>
.merchant-status-transition-label {
  display: flex;
  align-items: center;
}

.arrow {
  margin: 0 10px;
}
</style>
