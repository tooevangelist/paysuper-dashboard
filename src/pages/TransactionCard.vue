<script>
// import axios from 'axios';
import moment from 'moment';
import { PageHeader } from '@protocol-one/ui-kit';
import Commission from '@/mixins/commission';

export default {
  mixins: [Commission],
  components: {
    PageHeader,
  },
  asyncData() {
    // const self = this;

    // const url = `${process.env.VUE_APP_P1PAYAPI_URL}/api/v1/s/order/${context.route.params.id}`;

    // return axios.get(
    //   url,
    // )
    //   .then((response) => {
    //     if (!response.data) {
    //       return undefined;
    //     }

    //     return {
    //       order: response.data,
    //     };
    //   }).catch((e) => {
    //     self.error(self.getErrorMessage(e));
    //     self.$router.push('/transactions');
    //   });
  },
  data() {
    return {
      order: {
        id: '5c4b37a6f92fe5000189acd8',
        project: {
          id: '5c5d8ef821c3fd0001652f90',
          name: 'Universe of Futurama',
        },
        account: '',
        order_id: '',
        payer_data: {
          ip: '77.233.9.26',
          country_code_a2: 'RU',
          country_name: {
            en: 'Russia',
            ru: 'Россия',
          },
          city: {
            en: 'Krasnodar',
            ru: 'Краснодар',
          },
          subdivision: 'KDA',
          timezone: 'Europe/Moscow',
        },
        payment_requisites: null,
        payment_method: null,
        project_amount_income: {
          amount: 10,
          currency: {
            code_int: 840,
            code_a3: 'USD',
            name: [Object],
          },
        },
        project_amount_outcome: null,
        payment_method_amount_income: null,
        fixed_package: {
          id: 'nibbler',
          region: 'US',
          name: 'Nibbler',
          currency_int: 840,
          price: 10,
        },
        status: {
          status: 2,
          name: 'Error',
          description: 'Payment system reject create order request.',
        },
        created_at: 1548433318,
        confirmed_at: 1550863432,
        closed_at: 0,
        psp_fee: null,
        ps_fee_amount: null,
        project_fee_amount: null,
        to_payer_fee_amount: null,
        vat_amount: 0,
      },

    };
  },
  methods: {
    getPayerData(key) {
      let val = '&mdash;';

      if (this.order.payer_data && this.order.payer_data[key]
                    && this.order.payer_data[key].length > 0) {
        val = this.order.payer_data[key];
      }

      return val;
    },
  },
  computed: {
    breadcrumbs() {
      return [
        {
          label: 'Transactions search',
          url: '/transactions/',
          router: true,
        },
      ];
    },
    externalId() {
      return this.order.order_id && this.order.order_id.length > 0
        ? this.order.order_id : '&mdash;';
    },
    createDate() {
      return moment.unix(this.order.created_at).format('YYYY-MM-DD hh:mm:ss');
    },
    paymentDate() {
      if (!this.order.confirmed_at || this.order.confirmed_at === null) {
        return '&mdash;';
      }

      return moment.unix(this.order.confirmed_at).format('YYYY-MM-DD hh:mm:ss');
    },
    product() {
      let val = '&mdash;';

      if (this.order.fixed_package && this.order.fixed_package !== null
                    && this.order.fixed_package.name) {
        val = this.order.fixed_package.name;
      }

      return val;
    },
    projectLink() {
      return `/projects/${this.order.project.id}`;
    },
    paymentMethod() {
      let val = '&mdash;';

      if (this.order.payment_method && this.order.payment_method !== null) {
        val = this.order.payment_method.name;
      }

      return val;
    },
    hasPaymentDetails() {
      return this.order.payment_requisites
                    && Object.keys(this.order.payment_requisites).length > 0;
    },
  },
};
</script>

<template>
  <div>
    <PageHeader :breadcrumbs="breadcrumbs">
      <span slot="title">Transaction #{{order.id}}</span>
    </PageHeader>
    <div class="characteristic-container">
      <div>
        <h2>Transaction details</h2>

        <dl class="characteristic-group">
          <dt class="characteristic-name">
            <span class="characteristic-name-value">ID</span>
          </dt>
          <dd class="characteristic-value">
            <span class="characteristic-value-value">{{ order['id'] }}</span>
          </dd>
          <dt class="characteristic-name">
            <span class="characteristic-name-value">Create date</span>
          </dt>
          <dd class="characteristic-value">
            <span class="characteristic-value-value">{{ createDate }}</span>
          </dd>
          <dt class="characteristic-name">
            <span class="characteristic-name-value">Payment date</span>
          </dt>
          <dd class="characteristic-value">
            <span class="characteristic-value-value" v-html="paymentDate"></span>
          </dd>
          <dt class="characteristic-name">
            <span class="characteristic-name-value">External ID</span>
          </dt>
          <dd class="characteristic-value">
            <span class="characteristic-value-value" v-html="externalId"></span>
          </dd>
          <dt class="characteristic-name">
            <span class="characteristic-name-value">Amount</span>
          </dt>
          <dd class="characteristic-value">
            <span class="characteristic-value-value">{{ getAmount(order) }}</span>
          </dd>
          <dt class="characteristic-name">
            <span class="characteristic-name-value">Account</span>
          </dt>
          <dd class="characteristic-value">
            <span class="characteristic-value-value">{{ order['account'] }}</span>
          </dd>
          <dt class="characteristic-name">
            <span class="characteristic-name-value">Product</span>
          </dt>
          <dd class="characteristic-value">
            <span class="characteristic-value-value" v-html="product"></span>
          </dd>
          <dt class="characteristic-name">
            <span class="characteristic-name-value">Project</span>
          </dt>
          <dd class="characteristic-value">
            <span class="characteristic-value-value">
              <router-link :to="projectLink">{{ order['project']['name'] }}</router-link>
            </span>
          </dd>
          <dt class="characteristic-name">
            <span class="characteristic-name-value">Payment method</span>
          </dt>
          <dd class="characteristic-value">
            <span class="characteristic-value-value" v-html="paymentMethod"></span>
          </dd>
        </dl>
      </div>

      <div>
        <h2>Status</h2>

        <dl class="characteristic-group">
          <dt class="characteristic-name">
            <span class="characteristic-name-value">Status</span>
          </dt>
          <dd class="characteristic-value">
            <span class="characteristic-value-value">{{ order['status']['name'] }}</span>
          </dd>
          <dt class="characteristic-name">
            <span class="characteristic-name-value">Description</span>
          </dt>
          <dd class="characteristic-value">
            <span class="characteristic-value-value">{{ order['status']['description'] }}</span>
          </dd>
        </dl>
      </div>

      <div>
        <h2>Amount details</h2>

        <dl class="characteristic-group">
          <dt class="characteristic-name">
            <span class="characteristic-name-value">Payment amount</span>
          </dt>
          <dd class="characteristic-value">
            <span class="characteristic-value-value">{{ getAmount(order) }}</span>
          </dd>
          <dt class="characteristic-name">
            <span class="characteristic-name-value">P1 Fee</span>
          </dt>
          <dd class="characteristic-value">
            <span
              class="characteristic-value-value"
              v-html="getCommission(order, 'psp_fee')"
            ></span>
          </dd>
          <dt class="characteristic-name">
            <span class="characteristic-name-value">Payment System Fee</span>
          </dt>
          <dd class="characteristic-value">
            <span
              class="characteristic-value-value"
              v-html="getCommission(order, 'ps_fee_amount')"
            ></span>
          </dd>
          <dt class="characteristic-name">
            <span class="characteristic-name-value">VAT</span>
          </dt>
          <dd class="characteristic-value">
            <span
              class="characteristic-value-value"
              v-html="getCommission(order, 'vat_amount')"
            ></span>
          </dd>
          <dt class="characteristic-name">
            <span class="characteristic-name-value">Commission to payer</span>
          </dt>
          <dd class="characteristic-value">
            <span
              class="characteristic-value-value"
              v-html="getCommission(order, 'to_payer_fee_amount')"
            ></span>
          </dd>
          <dt class="characteristic-name">
            <span class="characteristic-name-value">Total commission</span>
          </dt>
          <dd class="characteristic-value">
            <span
              class="characteristic-value-value"
              v-html="getCommission(order, 'project_fee_amount')"
            ></span>
          </dd>
          <dt class="characteristic-name">
            <span class="characteristic-name-value">Payout amount</span>
          </dt>
          <dd class="characteristic-value">
            <span class="characteristic-value-value" v-html="getPayout(order)"></span>
          </dd>
        </dl>
      </div>

      <div>
        <h2>User details</h2>

        <dl class="characteristic-group">
          <dt class="characteristic-name">
            <span class="characteristic-name-value">Account</span>
          </dt>
          <dd class="characteristic-value">
            <span class="characteristic-value-value">{{ order['account'] }}</span>
          </dd>
          <dt class="characteristic-name">
            <span class="characteristic-name-value">Email</span>
          </dt>
          <dd class="characteristic-value">
            <span class="characteristic-value-value" v-html="getPayerData('email')"></span>
          </dd>
          <dt class="characteristic-name">
            <span class="characteristic-name-value">Phone</span>
          </dt>
          <dd class="characteristic-value">
            <span class="characteristic-value-value" v-html="getPayerData('phone')"></span>
          </dd>
          <dt class="characteristic-name">
            <span class="characteristic-name-value">IP</span>
          </dt>
          <dd class="characteristic-value">
            <span class="characteristic-value-value" v-html="getPayerData('ip')"></span>
          </dd>
          <dt class="characteristic-name">
            <span class="characteristic-name-value">Country, City</span>
          </dt>
          <dd class="characteristic-value">
            <span
              class="characteristic-value-value"
            >
              {{
                order['payer_data']['country_name']['en'] + ', ' +
                order['payer_data']['city']['en']
              }}
            </span>
          </dd>
        </dl>
      </div>

      <div v-if="hasPaymentDetails">
        <h2>Payment details</h2>

        <dl class="characteristic-group">
          <div v-for="(v, k) in order['payment_requisites']" :key="k">
            <dt class="characteristic-name">
              <span class="characteristic-name-value">{{ k }}</span>
            </dt>
            <dd class="characteristic-value">
              <span class="characteristic-value-value">{{ v }}</span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.characteristic-container {
  position: relative;
  width: 100%;
  padding: 15px;
}

.characteristic-group {
  position: relative;
  margin: 0 30px;
  padding: 10px 0 20px;

  .characteristic-name {
    display: inline-block;
    width: 48%;
    margin: 0 0 7px;
    vertical-align: top;
    background: #ffffff;

    .characteristic-name-value {
      position: relative;
      padding: 0 10px 0 0;
      background: inherit;
      z-index: 2;
    }
  }

  .characteristic-value {
    display: inline-block;
    width: 50%;
    margin: 0 0 7px;
    vertical-align: bottom;
    background: #ffffff;

    .characteristic-value-value {
      position: relative;
      display: block;
      padding: 0 0 0 10px;
      background: inherit;
      z-index: 2;
    }
  }
}
</style>
