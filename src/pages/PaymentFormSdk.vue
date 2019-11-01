<script>
import { trim } from 'lodash-es';
import { mapState } from 'vuex';
import assert from 'simple-assert';

export default {
  name: 'PaymentFormSdk',
  data() {
    let request = {};
    try {
      request = JSON.parse(localStorage.getItem('sdkTestRequest2'));
    } catch (error) {
      console.error(error);
    }
    return {
      project: '5dbae86359bccf00014e7812',
      products: ['5dbbb06f59bccf00014e9bde', '5dbbb0b959bccf00014e9bdf', '5dbbb14159bccf00014e9be0'],
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
    setType(type) {
      this.type = type;

      if (type === 'product') {
        this.products = ['5dbbb06f59bccf00014e9bde', '5dbbb0b959bccf00014e9bdf', '5dbbb14159bccf00014e9be0'];
      }
      if (type === 'key') {
        this.products = ['5dbbb97c59bccf00014e9be4', '5dbbbf5e59bccf00014e9beb'];
      }
    },
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

      localStorage.setItem('sdkTestRequest2', JSON.stringify(request));

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
  <UiRadio :checked="type === 'product'" @change="setType('product')">product</UiRadio>
  <UiRadio :checked="type === 'key'" @change="setType('key')">key</UiRadio>
  <UiRadio :checked="type === 'simple'" @change="setType('simple')">simple</UiRadio>
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
