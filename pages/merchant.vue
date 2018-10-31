<template>
    <div class="container-fluid">
        <div class="row">

            <div class="col-md-12">
                <div class="alert alert-info" role="alert" v-if="!getMerchant || getMerchant.status < 1">
                    Thanks for your registration. Please enter main information about your company before you create
                    first technical integration.
                </div>
            </div>

            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <strong>Add main information about your company</strong>
                    </div>
                    <div class="card-body">
                        <div class="form-group">
                            <label for="company">Name</label>
                            <input class="form-control" id="company" type="text" placeholder="Enter your company name" v-model="data.name">
                        </div>
                        <div class="form-group">
                            <label for="country">Country</label>
                            <v-select class="form" id="country" v-bind:options="countries" v-bind:placeholder="'Choose country'"
                                      @search="onCountrySearch" v-bind:onChange="onChangeCountry" v-model="country"></v-select>
                        </div>
                        <div class="form-group">
                            <label for="accounting-currency">Accounting currency</label>
                            <v-select class="form" id="accounting-currency" v-bind:options="currencies"
                                      v-bind:placeholder="'Choose your accounting currency'" @search="onCurrencySearch"
                                      v-bind:onChange="onChangeCurrency" v-model="currency"></v-select>
                        </div>
                        <div class="form-group">
                            <label for="accounting-period">Accounting period</label>
                            <v-select class="form" id="accounting-period" v-bind:options="accountingPeriods"
                                      v-bind:placeholder="'Choose your accounting period'"
                                      v-bind:onChange="onChangeAccountingPeriod" v-model="accountingPeriod"></v-select>
                        </div>

                        <div class="form-group btn float-right">
                            <button type="button" class="btn btn-outline-success btn-lg" @click="update">
                                <i class="fa fa-save"></i> Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import Notifications from '../mixins/notificaton';
    import Country from '../mixins/country';
    import Currency from '../mixins/currency';

    export default {
        middleware: 'IsNotAuthenticated',
        mixins: [Notifications, Currency, Country],
        data: function () {
            return {
                data: {},
                currency: null,
                country: null,
                accountingPeriod: null,
                accountingPeriods: [
                    { label: 'Every day', value: 'day' },
                    { label: 'Every week', value: 'week' },
                    { label: 'Every two week', value: '2week' },
                    { label: 'Every month', value: 'month' },
                    { label: 'Every quarter', value: 'quarter' },
                    { label: 'Every half-year', value: 'half-year' },
                    { label: 'Every year', value: 'year' }
                ]
            }
        },
        methods: {
            update: function () {
                const self = this;

                this['$store'].dispatch('merchant/update', this.data)
                    .then(function () {
                        self.success('Merchant data updated successfully');
                    }).catch(function (e) {
                        self.error(self.getError(e));
                    });
            },
            onChangeCountry: function (val) {
                this.data['country'] = val.value;
            },
            onChangeCurrency: function (val) {
                this.data['currency'] = val.value;
            },
            onChangeAccountingPeriod: function (val) {
                this.data['accounting_period'] = val.value;
            }
        },
        computed: {
            ...mapGetters({
                getMerchant: 'merchant/getMerchant'
            })
        },
        mounted: function () {
            this.data = Object.assign({}, this['$store'].state.merchant.merchant);

            if (this.data['country'] != null) {
                this.country = { label: this.data['country']['name']['en'], value: this.data['country']['code_int'] };
            }

            if (this.data['currency'] != null) {
                this.currency = { label: this.data['currency']['name']['en'], value: this.data['currency']['code_int'] };
            }

            for (let i = 0; i < this.accountingPeriods.length; i++) {
                if (this.data['accounting_period'] !== this.accountingPeriods[i]['value']) {
                    continue;
                }

                this.accountingPeriod = this.accountingPeriods[i];
            }
        }
    }
</script>