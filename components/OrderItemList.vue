<template>
    <div class="col-12 empty-items-message-container" v-if="dCount <= 0">
        You don't have transactions at current time
    </div>

    <table class="table table-responsive order-items" v-else>
        <tr>
            <th rowspan="2" class="no-wrap">ID</th>
            <th rowspan="2">Date</th>
            <th rowspan="2" class="no-wrap">External ID</th>
            <th rowspan="2">Project</th>
            <th rowspan="2">Payment method</th>
            <th rowspan="2">Product</th>
            <th rowspan="2">Total amount</th>
            <th colspan="7">Payment information</th>
            <th rowspan="2">Country, City</th>
        </tr>
        <tr>
            <th>Payment amount</th>
            <th>P1 Fee</th>
            <th>Payment System Fee</th>
            <th>VAT</th>
            <th>Commission to payer</th>
            <th>Total commission</th>
            <th>Payout amount</th>
        </tr>
        <tr v-for="item in items" :key="item['id']">
            <td class="no-wrap">
                <nuxt-link v-bind:to="'/order/' + item['id']">
                    <span class="badge" :class="getStateClass(item)">{{ getStateText(item) }}</span>
                    {{ item['id'] }}
                </nuxt-link>
            </td>
            <td class="no-wrap">
                <nuxt-link v-bind:to="'/order/' + item['id']">
                    {{ getDate(item) }}
                </nuxt-link>
            </td>
            <td v-html="getExternalId(item)"></td>
            <td>
                <nuxt-link v-bind:to="'/project/' + item['project']['id']">
                    {{ item['project']['name'] }}
                </nuxt-link>
            </td>
            <td v-html="getPaymentMethodName(item)"></td>
            <td v-html="getFixedPackageName(item)"></td>
            <td v-html="getPaymentSystemIncomeAmount(item)"></td>
            <td v-html="getPaymentSystemIncomeAmount(item)"></td>
            <td v-html="getCommission(item, 'psp_fee')"></td>
            <td v-html="getCommission(item, 'ps_fee_amount')"></td>
            <td v-html="getCommission(item, 'vat_amount')"></td>
            <td v-html="getCommission(item, 'to_payer_fee_amount')"></td>
            <td v-html="getCommission(item, 'project_fee_amount')"></td>
            <td v-html="getPayout(item)"></td>
            <td>{{ item['payer_data']['country_name']['en'] + ' (' + item['payer_data']['city']['en'] + ')' }}</td>
        </tr>
    </table>
</template>

<script>
    import Commission from '../mixins/commission';

    export default {
        mixins: [Commission],
        props: {
            count: {
                type: Number,
                required: true
            },
            items: {
                type: Array,
                request: true
            }
        },
        data: function () {
            return {
                dCount: 0,
                dItems: []
            }
        },
        methods: {
            getStateClass: function(item) {
                const state = item['status']['status'];

                let classObject = {};

                switch (state) {
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                        classObject['badge-success'] = true;
                        break;
                    case 8:
                        classObject['badge-danger'] = true;
                        break;
                    case 9:
                    case 10:
                        classObject['badge-warning'] = true;
                        break;
                    default:
                        classObject['badge-secondary'] = true;
                }

                return classObject;
            },
            getStateText: function(item) {
                const state = item['status']['status'];

                let text;

                switch (state) {
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                        text = 'Paid';
                        break;
                    case 8:
                        text = 'Error';
                        break;
                    case 9:
                        text = 'Refund';
                        break;
                    case 10:
                        text = 'Chargeback';
                        break;
                    default:
                        text = 'Init';
                }

                return text;
            },
            getDate: function(item) {
                return this.$moment.unix(item['created_at']).format('YYYY-MM-DD hh:mm a');
            },
            getExternalId: function(item) {
                return item.hasOwnProperty('order_id') && item['order_id'].length > 0 ? item['order_id'] : '&mdash;';
            },
            getPaymentMethodName: function(item) {
                let val = '&mdash;';

                if (item.hasOwnProperty('payment_method') && item['payment_method'] !== null) {
                    val = item['payment_method']['name'];
                }

                return val;
            },
            getFixedPackageName: function(item) {
                let val = '&mdash;';

                if (item.hasOwnProperty('fixed_package') && item['fixed_package'] !== null
                    && item['fixed_package'].hasOwnProperty('name')) {
                    val = item['fixed_package']['name'];
                }

                return val;
            },
            getPaymentSystemIncomeAmount: function (item) {
                if (!item.hasOwnProperty('payment_method_amount_income')
                    || item['payment_method_amount_income'] === null) {
                    return '&mdash;';
                }

                return item['payment_method_amount_income']['amount'] + ' ' + item['payment_method_amount_income']['currency']['code_a3'];
            }
        },
        watch: {
            count: function (value) {
                this.dCount = value;
            },
            items: function (value) {
                this.dItems = value;
            }
        },
        mounted: function () {
            this.dCount = this.count;
            this.dItems = this.items;
        }
    };
</script>

<style lang="scss">
    table.order-items {
        th {
            font-size: 0.6rem;
            font-weight: 600;
            text-align: left;
            vertical-align: middle;
        }
        th.no-wrap,
        td.no-wrap {
            white-space: nowrap;
        }
        td {
            font-size: 0.5rem;
            font-weight: normal;

            span.badge {
                margin-right: 3px;
            }
        }
    }

    div.empty-items-message-container {
        height: 120px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
    }
</style>