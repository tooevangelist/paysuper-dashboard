<script>
import { trim } from 'lodash-es';
import { mapState } from 'vuex';
import assert from 'simple-assert';

export default {
  name: 'PaymentFormSdk',
  data() {
    let request = {};
    try {
      request = JSON.parse(localStorage.getItem('sdkTestRequest'));
    } catch (error) {
      console.error(error);
    }
    return {
      project: '5cd5620f06ae110001509185',
      products: ['5d848f484dd6a50001970479', '5d8c7a219e362100013de214'],
      type: 'product',
      currency: 'USD',
      amount: 30,
      ...request,
    };
  },
  computed: {
    ...mapState(['config']),

    productsString: {
      get() {
        return this.products.join(',');
      },
      set(value) {
        this.products = value.split(',').map(item => trim(item));
      },
    },
  },
  async created() {
    assert(this.config.paysuperJsSdkUrl, 'paysuperJsSdkUrl is not defined');
    const script = document.createElement('script');
    script.src = this.config.paysuperJsSdkUrl;
    document.head.appendChild(script);
  },

  methods: {
    buy() {
      let request = {
        project: this.project,
        type: this.type,
      };

      if (this.type === 'product' || this.type === 'key') {
        request = {
          ...request,
          products: this.products,
        };
      } else if (this.type === 'simple') {
        request = {
          ...request,
          amount: this.amount,
          currency: this.currency,
        };
      }

      localStorage.setItem('sdkTestRequest', JSON.stringify(request));

      const paySuper = new window.PaySuper({
        apiUrl: 'https://p1payapi.tst.protocol.one',
        ...request,
      });
      paySuper.renderModal();
    },
  },
};
</script>

<template>
<div class="payment-form-sdk">
  <UiRadio :checked="type === 'product'" @change="type = 'product'">product</UiRadio>
  <UiRadio :checked="type === 'key'" @change="type = 'key'">key</UiRadio>
  <UiRadio :checked="type === 'simple'" @change="type = 'simple'">simple</UiRadio>
  <br>
  <UiTextField label="project" v-model="project" />
  <UiTextField v-if="type !== 'simple'" label="products" v-model="productsString" />
  <div class="simple" v-if="type === 'simple'">
    <UiTextField :isNumeric="true" label="amount" v-model="amount" />
    <UiTextField label="currency" v-model="currency" />
  </div>

  <UiButton class="submit" @click="buy">BUY</UiButton>
</div>
</template>

<style lang="scss" scoped>
.payment-form-sdk {
  width: 600px;
}
.simple {
  display: flex;
}
.submit {
  width: 120px;
}
@media screen and (max-width: 640px) {
  .payment-form-sdk {
    width: 300px;
  }
  .simple {
    display: block;
  }
}
</style>
