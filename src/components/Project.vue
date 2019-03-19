<template>
  <div class="card">
    <div class="card-header">
      <Button @click="save">Save</Button>
      <Button
        class="pull-right"
        :color="data.is_active ? 'orange' : 'green'"
        @click="save"
      >
        {{ data.is_active ? 'Deactivate' : 'Activate' }}
      </Button>
    </div>
    <div class="card-body">
      <div class="form-group" v-if="true">
        <label for="name">Name</label>
        <input
          class="form-control"
          id="name"
          type="text"
          placeholder="Enter project name"
          v-model="data['name']"
        >
      </div>

      <div class="form-group" v-if="true">
        <label for="url-check">Validation request URL</label>
        <input
          class="form-control"
          id="url-check"
          type="text"
          placeholder="Enter URL for send validation request"
          v-model="data['url_check_account']"
        >
      </div>

      <div class="form-group" v-if="true">
        <label for="url-notify">Payment notify request URL</label>
        <input
          class="form-control"
          id="url-notify"
          type="text"
          placeholder="Enter URL for send payment completed request"
          v-model="data['url_process_payment']"
        >
      </div>

      <div class="form-group" v-if="true">
        <label for="create-order-allowed-urls">Create order allowed URLs</label>
        <input
          class="form-control"
          id="create-order-allowed-urls"
          type="text"
          placeholder="Enter create order allowed URLs"
          v-model="createInvoiceAllowedUrls"
        >
        <small id="create-order-allowed-urls-help" class="form-text text-muted">
          Request for creation order will be possible only from the URLs specified here.
          List URLs through comma.
        </small>
      </div>

      <div class="form-group" v-if="true">
        <label for="url-redirect-success">
          URL for redirect user after
          successfully completed payment
        </label>
        <input
          class="form-control"
          id="url-redirect-success"
          type="text"
          placeholder="Enter URL for redirect user after successfully completed payment"
          v-model="data['url_redirect_success']"
        >
      </div>

      <div class="form-group" v-if="true">
        <label for="url-redirect-fail">URL for redirect user after failed payment</label>
        <input
          class="form-control"
          id="url-redirect-fail"
          type="text"
          placeholder="Enter URL for redirect user after failed payment"
          v-model="data['url_redirect_fail']"
        >
      </div>

      <div class="form-group">
        <label>Callback request currency</label>
        <v-select
          class="form"
          v-bind:options="currencies"
          v-bind:placeholder="'Select callback request currency'"
          @search="onCurrencySearch"
          v-bind:onChange="onChangeCallbackCurrency"
          v-model="callbackCurrency"
          v-bind:filterable="false"
        ></v-select>
        <small id="callback-currency-help" class="form-text text-muted">
          If the currency is not selected,
          the value for callback requests will be taken from the merchant's currency settings.
        </small>
      </div>

      <div class="form-group">
        <label>Limits currency</label>
        <v-select
          class="form"
          v-bind:options="currencies"
          v-bind:placeholder="'Select limits currency'"
          @search="onCurrencySearch"
          v-bind:onChange="onChangeLimitsCurrency"
          v-bind:filterable="false"
          v-model="limitsCurrency"
        ></v-select>
        <small id="limit-currency-help" class="form-text text-muted">
          If the currency is not selected,
          the currency for min and max payment amount will be taken from the
          merchant's currency settings.
        </small>
      </div>

      <div class="form-group">
        <div class="row">
          <div class="col">
            <label for="min-payment-amount">Min amount allowed to payment</label>
            <input
              class="form-control"
              id="min-payment-amount"
              type="text"
              placeholder="Enter min payment amount"
              @keyup="formatAmount('min_payment_amount')"
              v-model="data['min_payment_amount']"
            >
            <small class="form-text text-muted">
              Amount in currency of limit. Decimal separator is dot (".").
              Possible 2 digit after decimal
              separator. For example: 10.23
            </small>
          </div>
          <div class="col">
            <label for="max-payment-amount">Max amount allowed to payment</label>
            <input
              class="form-control"
              id="max-payment-amount"
              type="text"
              placeholder="Enter max payment amount"
              @keyup="formatAmount('max_payment_amount')"
              v-model="data['max_payment_amount']"
            >
            <small class="form-text text-muted">
              Amount in currency of limit. Decimal separator is dot (".").
              Possible 2 digit after decimal
              separator. For example: 10.23
            </small>
          </div>
        </div>
      </div>

      <div class="form-group">
        <div class="form-check">
          <input
            type="checkbox"
            class="form-check-input"
            id="send-email-notify"
            v-model="data['send_notify_email']"
          >
          <label class="form-check-label" for="send-email-notify">
            Notify about successful payments via
            email
          </label>
        </div>
      </div>

      <div class="form-group">
        <div class="form-check">
          <input
            type="checkbox"
            class="form-check-input"
            id="only-fixed-packages"
            v-model="data['only_fixed_amounts']"
          >
          <label class="form-check-label" for="only-fixed-packages">
            Allow payments only fixed amount
            packages
          </label>
        </div>
      </div>

      <div class="form-group">
        <div class="form-check">
          <input
            type="checkbox"
            class="form-check-input"
            id="is-allow-dynamic-notify-urls"
            v-model="data['is_allow_dynamic_notify_urls']"
          >
          <label class="form-check-label" for="is-allow-dynamic-notify-urls">
            Allow send validation url and
            notification url in the order create request
          </label>
        </div>
      </div>

      <div class="form-group">
        <div class="form-check">
          <input
            type="checkbox"
            class="form-check-input"
            id="is-allow-dynamic-redirect-urls"
            v-model="data['is_allow_dynamic_redirect_urls']"
          >
          <label class="form-check-label" for="is-allow-dynamic-redirect-urls">
            Allow send user's redirect urls
            in the order create request
          </label>
        </div>
      </div>

      <div class="form-group" v-if="data['send_notify_email'] === true">
        <label for="notify-emails">Emails for payments notifications</label>
        <input
          class="form-control"
          id="notify-emails"
          type="text"
          placeholder="Enter emails for payments notifications"
          v-model="notifyEmails"
        >
        <small id="notify-emails-help" class="form-text text-muted">
          On this emails list will be send notifications about successfully completed payments.
          List URLs through comma.
        </small>
      </div>

      <div class="row" v-if="data['only_fixed_amounts'] === true">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header">
              <div class="row">
                <div class="col">Fixed Packages</div>
                <div class="col text-right">
                  <button
                    type="button"
                    class="btn btn-outline-success btn-sm"
                    @click="addFixedPackage"
                  >
                    <i class="fa fa-plus"></i> Add new
                  </button>
                </div>
              </div>
            </div>
            <div class="card-body">
              <ul class="nav nav-tabs">
                <li class="nav-item">
                  <a
                    class="nav-link"
                    href="#"
                    @click.prevent="fixedPackageRegion = 'US'"
                    :class="{ 'active': fixedPackageRegion === 'US' }"
                  >For USA</a>
                </li>

                <li class="nav-item">
                  <a
                    class="nav-link"
                    href="#"
                    @click.prevent="fixedPackageRegion = 'RU'"
                    :class="{ 'active': fixedPackageRegion === 'RU' }"
                  >For Russia</a>
                </li>
              </ul>

              <div class="row">
                <div class="col-md-12" v-if="hasFixedPackage === false">
                  Fixed pages
                  list is empty
                </div>

                <template v-if="hasFixedPackage === true">
                  <div
                    class="col-md-12 field-group"
                    v-for="(item, index) in data['fixed_package'][fixedPackageRegion]"
                    v-bind:key="index"
                  >
                    <div class="form-group text-right" v-if="isNew">
                      <a href="#" @click.prevent="removeFixedPackage(index)">
                        <span class="fa fa-close"></span>
                      </a>
                    </div>

                    <div class="form-group">
                      <label>Name</label>
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Enter fixed package name"
                        v-model="item['name']"
                        @blur="getPackageSlug(index)"
                      >
                    </div>

                    <div class="form-group">
                      <label>Identifier</label>
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Enter unique package identifier"
                        v-model="item['id']"
                      >
                      <small class="form-text text-muted">
                        You can enter custom package identifier. Identifier must contain only
                        symbols from
                        latin alphabet, numbers and underscore symbol (Aa0-Zz9_)
                      </small>
                    </div>

                    <div class="form-group">
                      <div class="row">
                        <div class="col">
                          <label>Price</label>
                          <input
                            class="form-control"
                            type="text"
                            placeholder="Enter fixed package price"
                            v-model="item['price']"
                          >
                          <small class="form-text text-muted">
                            Decimal separator is dot ("."). Possible 2 digit after decimal
                            separator. For example: 10.23
                          </small>
                        </div>

                        <div class="col">
                          <label>Price currency</label>
                          <v-select
                            class="form"
                            v-bind:options="currencies"
                            v-bind:placeholder="'Select currency for price'"
                            @search="onCurrencySearch"
                            v-bind:filterable="false"
                            v-model="item['currency_int']"
                          ></v-select>
                          <small class="form-text text-muted">
                            If the currency is not selected, the currency for min and max
                            payment amount will be taken from the merchant's currency settings.
                          </small>
                        </div>
                      </div>
                    </div>

                    <div class="form-group text-right" v-if="!isNew">
                      <button
                        type="button"
                        class="btn btn-sm"
                        @click="item['is_active'] = !item['is_active']"
                        :class="{
                          'btn-outline-danger': item['is_active'],
                          'btn-outline-success': !item['is_active']
                        }"
                      >
                        <i
                          class="fa"
                          :class="{
                            'fa-eye-slash': item['is_active'],
                            'fa-eye': !item['is_active']
                          }"
                        ></i>
                        {{ item['is_active'] ? 'Deactivate' : 'Activate' }}
                      </button>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Button } from '@protocol-one/ui-kit';
import Notifications from '@/mixins/notificaton';
import Currency from '@/mixins/currency';
import Validate from '@/mixins/validate';

export default {
  mixins: [Notifications, Currency, Validate],
  components: {
    Button,
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      data: {
        name: '',
        callback_currency: null,
        callback_protocol: 'default',
        create_invoice_allowed_urls: [],
        limits_currency: null,
        max_payment_amount: null,
        min_payment_amount: null,
        notify_emails: [],
        secret_key: '',
        url_check_account: null,
        url_process_payment: null,
        url_redirect_fail: null,
        url_redirect_success: null,
        is_active: true,
        fixed_package: { US: [], RU: [] },
        send_notify_email: false,
        only_fixed_amounts: false,
        is_allow_dynamic_notify_urls: false,
        is_allow_dynamic_redirect_urls: false,
      },
      fixedPackageRegion: 'US',
      callbackCurrency: null,
      limitsCurrency: null,
      createInvoiceAllowedUrls: '',
      notifyEmails: '',
      localCurrencies: [],
    };
  },
  methods: {
    addFixedPackage() {
      this.data.fixed_package[this.fixedPackageRegion].unshift({
        id: '',
        name: '',
        currency_int: null,
        price: null,
        is_active: true,
        IsNew: true,
      });
    },
    removeFixedPackage(index) {
      this.data.fixed_package[this.fixedPackageRegion].splice(index, 1);
    },
    formatAmount(field) {
      if (!this.data.field) {
        return;
      }

      const match = (/(\d{0,9})[^.]*((?:\.\d{0,2})?)/g).exec(this.data[field].replace(/[^\d.]/g, ''));
      this.data[field] = match[1] + match[2];
    },
    onChangeCallbackCurrency(val) {
      if (val === null) {
        this.data.callback_currency = null;
      } else {
        this.data.callback_currency = val.value;
      }
    },
    onChangeLimitsCurrency(val) {
      if (val === null) {
        this.data.limits_currency = null;
      } else {
        this.data.limits_currency = val.value;
      }
    },
    beforeSave() {
      const { $ } = window;
      if (this.data.name.length <= 0) {
        return 'Project name can not be empty';
      }

      if (this.data.url_check_account != null && this.data.url_check_account.length > 0
                    && !this.isUrl(this.data.url_check_account)) {
        return 'Validation request URL is invalid';
      }

      if (this.data.url_process_payment != null && this.data.url_process_payment.length > 0
                    && !this.isUrl(this.data.url_process_payment)) {
        return 'Payment notify request URL is invalid';
      }

      if (this.data.url_redirect_success != null && this.data.url_redirect_success.length > 0
                    && !this.isUrl(this.data.url_redirect_success)) {
        return 'Successful payment redirect URL is invalid';
      }

      if (this.data.url_redirect_fail != null && this.data.url_redirect_fail.length > 0
                    && !this.isUrl(this.data.url_redirect_fail)) {
        return 'Failed payment redirect URL is invalid';
      }

      if (this.data.min_payment_amount != null) {
        this.data.min_payment_amount = parseFloat(this.data.min_payment_amount);

        if (this.data.min_payment_amount <= 0) {
          return 'Min payment amount must be greater than 0';
        }
      }

      if (this.data.max_payment_amount != null) {
        this.data.max_payment_amount = parseFloat(this.data.max_payment_amount);

        if (this.data.max_payment_amount <= 0) {
          return 'Max payment amount must be greater than 0';
        }
      }

      let urls = [];
      let counter = 0;

      if (this.createInvoiceAllowedUrls.length > 0) {
        urls = this.createInvoiceAllowedUrls.split(',');

        for (let i = 0; i < urls.length; i += 1) {
          urls[i] = $.trim(urls[i]);

          if (!this.isUrl(urls[i])) {
            counter += 1;
          }
        }

        if (counter > 0) {
          return `${counter} URLs which allowed create payment order is incorrect`;
        }

        this.data.create_invoice_allowed_urls = urls;
      }

      if (this.notifyEmails.length > 0) {
        urls = this.notifyEmails.split(',');

        for (let i = 0; i < urls.length; i += 1) {
          urls[i] = $.trim(urls[i]);

          if (!this.isEmail(urls[i])) {
            counter += 1;
          }
        }

        if (counter > 0) {
          return `${counter} emails for payments notifications is incorrect`;
        }

        this.data.notify_emails = urls;
      }

      return '';
    },
    save() {
      const error = this.beforeSave();

      if (error.length > 0) {
        return this.error(error);
      }

      const self = this;
      let promise;

      Object.keys(this.data.fixed_package).forEach((key) => {
        if (!this.data.fixed_package[key]) {
          return;
        }

        if (this.data.fixed_package[key].length <= 0) {
          return;
        }

        for (let i = 0; i < this.data.fixed_package[key].length; i += 1) {
          this.data.fixed_package[key][i].price = parseFloat(this.data.fixed_package[key][i].price);

          if (this.data.fixed_package[key][i].currency_int != null) {
            // eslint-disable-next-line
            this.data.fixed_package[key][i].currency_int = this.data.fixed_package[key][i].currency_int.value;
          }
        }
      });

      console.log(11111, 'this.data', this.data);

      if (this.isNew === true) {
        promise = axios.post(`${process.env.VUE_APP_P1PAYAPI_URL}/api/v1/s/project`, this.data, {
          headers: { Authorization: `Bearer ${this.$store.state.User.accessToken}` },
        });
      } else {
        promise = axios.put(`${process.env.VUE_APP_P1PAYAPI_URL}/api/v1/s/project/${this.data.id}`, this.data, {
          headers: { Authorization: `Bearer ${this.$store.state.User.accessToken}` },
        });
      }

      return promise.then(() => {
        if (self.isNew === true) {
          self.success('Project created successfully');
        } else {
          self.success('Project updated successfully');
        }

        self.$router.push('/projects');
      }).catch((e) => {
        self.error(self.getErrorMessage(e));
      });
    },
    getPackageSlug(index) {
      if (this.data.fixed_package[this.fixedPackageRegion][index].name.length <= 0) {
        return;
      }

      const url = `${process.env.VUE_APP_P1PAYAPI_URL}/slug?text=${this.data.fixed_package[this.fixedPackageRegion][index].name}`;
      const self = this;

      axios.get(url).then((response) => {
        if (!response.data || !response.data.slug) {
          return;
        }

        self.data.fixed_package[self.fixedPackageRegion][index].id = response.data.slug;
      }).catch(() => {});
    },
  },
  computed: {
    hasFixedPackage() {
      return this.data.fixed_package[this.fixedPackageRegion].length > 0;
    },
    isNew() {
      return !this.data.id;
    },
  },
  mounted() {
    if (Object.keys(this.project).length <= 0) {
      return;
    }

    const data = this.project;

    if (data.callback_currency && data.callback_currency != null
                && typeof data.callback_currency === 'object') {
      data.callback_currency = {
        label: data.callback_currency.name.en,
        value: data.callback_currency.code_int,
      };

      this.callbackCurrency = data.callback_currency;
    }

    if (data.limits_currency && data.limits_currency != null
                && typeof data.limits_currency === 'object') {
      data.limits_currency = {
        label: data.limits_currency.name.en,
        value: data.limits_currency.code_int,
      };

      this.limitsCurrency = data.limits_currency;
    }

    if (data.create_invoice_allowed_urls && data.create_invoice_allowed_urls != null
                && Array.isArray(data.create_invoice_allowed_urls)) {
      if (data.create_invoice_allowed_urls.length > 0) {
        data.create_invoice_allowed_urls = data.create_invoice_allowed_urls.join(', ');
        this.createInvoiceAllowedUrls = data.create_invoice_allowed_urls;
      }
    }

    if (data.notify_emails && data.notify_emails != null
                && Array.isArray(data.notify_emails)) {
      if (data.notify_emails.length > 0) {
        data.notify_emails = data.notify_emails.join(', ');
        this.notifyEmails = data.notify_emails;
      }
    }

    if (data.fixed_package != null && typeof data.fixed_package === 'object') {
      Object.keys(this.data.fixed_package).forEach((key) => {
        if (!data.fixed_package[key]) {
          return;
        }

        if (data.fixed_package[key].length <= 0) {
          return;
        }

        for (let i = 0; i < data.fixed_package[key].length; i += 1) {
          if (data.fixed_package[key][i].currency_int == null
                            || data.fixed_package[key][i].currency_int <= 0) {
            data.fixed_package[key][i].currency_int = null;
            // eslint-disable-next-line
            continue;
          }

          data.fixed_package[key][i].currency_int = {
            label: data.fixed_package[key][i].currency.name.en,
            value: data.fixed_package[key][i].currency.code_int,
          };
        }
      });
    }

    this.data = { ...this.data, ...data };
  },
};
</script>
