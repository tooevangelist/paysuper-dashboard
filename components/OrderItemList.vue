<template>
    <div>
        <div class="col-12 empty-items-message-container" v-if="dCount <= 0">
            You don't have transactions at current time
        </div>

        <div class="row" style="margin: 20px;" v-if="dCount > 0">
            <div class="col-12 text-right">
                <div class="form-group row" style="align-items: center">
                    <label for="sort-by" class="col-10 col-form-label">Sort by:</label>
                    <div class="col-2">
                        <select id="sort-by" class="form-control form-control-sm" v-model="sortBy">
                            <option v-for="(item, id) in sortByVariants" :key="id" v-bind:value="id">{{ item }}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="col-12 text-right">
                <div class="form-group row" style="align-items: center">
                    <label for="items-per-page" class="col-10 col-form-label">Items per page:</label>
                    <div class="col-2">
                        <select id="items-per-page" class="form-control form-control-sm" v-model="limit">
                            <option v-for="(item, id) in limitVariants" :key="id" v-bind:value="item">{{ item }}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="row" v-if="dCount > 0">
            <div class="col-12">
                <table class="table table-responsive order-items">
                    <tr>
                        <th rowspan="2" class="no-wrap">ID</th>
                        <th rowspan="2">Date</th>
                        <th rowspan="2" class="no-wrap">External ID</th>
                        <th rowspan="2">Project</th>
                        <th rowspan="2">Payment method</th>
                        <th rowspan="2">Product</th>
                        <th rowspan="2">Total amount</th>
                        <th colspan="7" style="text-align: center;">Payment information</th>
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
                                <span class="badge" :class="getStateClass(item)">{{ item['status']['name'] }}</span>
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
                        <td>{{ getAmount(item) }}</td>
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
            </div>
        </div>

        <div class="row" v-if="dCount > 0">
            <div class="col-12">
                <b-pagination
                        size="sm"
                        align="right"
                        :limit="3"
                        :per-page="limit"
                        :total-rows="dCount"
                        v-model="currentPage"
                        @change="onPageChange">
                </b-pagination>
            </div>
        </div>
    </div>
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
                dItems: [],
                currentPage: 1,
                limit: 10,
                offset: 0,
                limitVariants: [10, 30, 50, 100, 300],
                sortBy: '_id',
                aSortBy: ['_id'],
                sortByVariants: {
                    '_id': 'ID asc',
                    '-_id': 'ID desc',
                    'created_at': 'Date asc',
                    '-created_at': 'Date desc',
                    'order_id': 'External ID asc',
                    '-order_id': 'External ID desc',
                    'project.name': 'Project asc',
                    '-project.name': 'Project desc',
                    'payment_method.name': 'Payment method asc',
                    '-payment_method.name': 'Payment method desc',
                    'fixed_package.name': 'Product asc',
                    '-fixed_package.name': 'Product desc',
                    'project_amount_income': 'Total amount asc',
                    '-project_amount_income': 'Total amount desc',
                    'cc': 'Country, City asc',
                    '-cc': 'Country, City desc',
                }
            }
        },
        methods: {
            onPageChange(index) {
                this.offset = this.limit * (index - 1);
                this.$router.push({path: 'order', query: { limit: this.limit, offset: this.offset }});

                this.$emit('onPageChange', this.limit, this.offset, this.aSortBy);
            },
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
            },
            limit: function () {
                this.onPageChange(this.currentPage);
            },
            sortBy: function (value) {
                if (value === 'cc') {
                    this.aSortBy = ['payer_data.country_name.en', 'payer_data.city.en'];
                } else if (value === "-cc") {
                    this.aSortBy = ['-payer_data.country_name.en', '-payer_data.city.en'];
                } else {
                    this.aSortBy = [value];
                }

                this.onPageChange(this.currentPage);
            }
        },
        mounted: function () {
            this.dCount = this.count;
            this.dItems = this.items;

            const query = this['$route']['query'];

            if (query.hasOwnProperty('limit') && parseInt(query['limit']) > 0) {
                this.limit = parseInt(query['limit']);
            }

            if (query.hasOwnProperty('offset') && parseInt(query['offset']) > 0) {
                this.offset = parseInt(query['offset']);
            }

            this.onPageChange(this.currentPage);
        }
    };
</script>

<style lang="scss">
    table.order-items {
        th {
            font-size: 0.55rem;
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