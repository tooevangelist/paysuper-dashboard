<template>
    <div class="search-container">
        <button type="button" class="btn btn-outline-success btn btn-sm btn-filters" :class="{ 'hide': !isShowed }"
                @click="isShowed = !isShowed">
            <i class="fa" :class="{ 'fa-angle-double-down': !isShowed, 'fa fa-angle-double-up': isShowed }"></i>
            {{ isShowed ? 'Hide' : 'Show' }} filters
        </button>

        <div class="search-panel-container" :class="{ hide: !isShowed, show: isShowed }">
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label>ID</label>
                        <input class="form-control" type="text" placeholder="Enter ID" v-model="values.id"/>
                    </div>

                    <div class="form-group">
                        <label>Project</label>
                        <v-multiselect
                                v-model="values.project"
                                :options="projects"
                                :multiple="true"
                                :close-on-select="false"
                                :clear-on-select="false"
                                :preserve-search="true"
                                track-by="value"
                                label="label"
                                placeholder="Select projects">
                        </v-multiselect>
                    </div>

                    <div class="form-group">
                        <label>Payment method</label>
                        <v-multiselect
                                v-model="values.paymentMethod"
                                :options="paymentMethods"
                                :multiple="true"
                                :close-on-select="false"
                                :clear-on-select="false"
                                :preserve-search="true"
                                track-by="value"
                                label="label"
                                placeholder="Select payment method">
                        </v-multiselect>
                    </div>
                </div>

                <div class="col">
                    <div class="form-group">
                        <label>Account</label>
                        <input class="form-control" type="text" placeholder="Enter user account" v-model="values.account"/>
                    </div>

                    <div class="form-group">
                        <label>Country</label>
                        <v-multiselect
                                v-model="values.country"
                                :options="countries"
                                :multiple="true"
                                :close-on-select="false"
                                :clear-on-select="false"
                                :preserve-search="true"
                                track-by="value"
                                label="label"
                                :internal-search="false"
                                :searchable="true"
                                :loading="isLoading"
                                @search-change="onCountrySearch"
                                placeholder="Select country">
                        </v-multiselect>
                    </div>

                    <div class="form-group">
                        <label>Status</label>
                        <v-multiselect
                                v-model="values.status"
                                :options="statuses"
                                :multiple="true"
                                :close-on-select="false"
                                :clear-on-select="false"
                                :preserve-search="true"
                                placeholder="Select status">
                        </v-multiselect>
                    </div>
                </div>

                <div class="col">
                    <div class="form-group">
                        <label>Created date</label>
                        <v-datepicker
                                v-model="values.createDate"
                                range
                                placeholder="Select created dates range"
                                lang="en"
                                :shortcuts="shortcuts">
                        </v-datepicker>
                    </div>

                    <div class="form-group">
                        <label>Paid date</label>
                        <v-datepicker
                                v-model="values.paidDate"
                                range
                                placeholder="Select paid dates range"
                                lang="en"
                                :shortcuts="shortcuts">
                        </v-datepicker>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <button type="button" class="btn btn-outline-success pull-right" @click="search">
                        <i class="fa fa-search"></i> Search
                    </button>
                </div>
            </div>
        </div>

        <div class="col-12" style="height: 20px; background: #e4e5e6;" v-if="isShowed"></div>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        data: function () {
            return {
                dLimit: this.limit,
                dOffset: this.offset,
                isShowed: false,
                values: {
                    id: null,
                    account: null,
                    createDate: '',
                    paidDate: '',
                    country: null,
                    project: null,
                    paymentMethod: null,
                    status: null,

                },
                projects: [],
                paymentMethods: [],
                statuses: ['New', 'In payment', 'Error', 'Paid', 'In progress', 'Completed', 'Pending', 'Refund', 'Chargeback', 'Declined', 'Canceled'],
                oStatuses: {
                    'New': [0],
                    'In payment': [1],
                    'Error': [2, 3],
                    'Paid': [4],
                    'In progress': [5],
                    'Completed': [6],
                    'Pending': [7],
                    'Refund': [8, 9],
                    'Chargeback': [10],
                    'Declined': [11],
                    'Canceled': [12]
                },
                countries: [],
                isLoading: false,
                shortcuts: [
                    {
                        text: 'Today',
                        start: this.$moment(),
                        end: this.$moment()
                    },
                    {
                        text: 'Yesterday',
                        start: this.$moment().subtract(1, 'days'),
                        end: this.$moment().subtract(1, 'days')
                    },
                    {
                        text: 'Current week',
                        start: this.$moment().startOf('week'),
                        end: this.$moment().endOf('week')
                    },
                    {
                        text: 'Current month',
                        start: this.$moment().startOf('month'),
                        end: this.$moment().endOf('month')
                    },
                    {
                        text: 'Last month',
                        start: this.$moment().subtract(1, 'month').startOf('month'),
                        end: this.$moment().subtract(1, 'month').endOf('month')
                    },
                    {
                        text: 'Current year',
                        start: this.$moment().startOf('year'),
                        end: this.$moment().endOf('year')
                    },
                    {
                        text: 'Last year',
                        start: this.$moment().subtract(1, 'year').startOf('year'),
                        end: this.$moment().subtract(1, 'year').endOf('year')
                    }
                ]
            }
        },
        methods: {
            getProjects: function () {
                const self = this;

                let url = `${process.env.apiServerUrl}/api/v1/s/project/filters`;

                axios.get(url, {headers: { Authorization: `Bearer ${this['$store'].state.user.accessToken}` }})
                    .then(function (response) {
                        if (!response.hasOwnProperty('data')) {
                            return;
                        }

                        for (let key in response.data) {
                            if (!response.data.hasOwnProperty(key)) {
                                continue;
                            }

                            self.projects.push({value: key, label: response.data[key] });
                        }
                    }).catch(function (e) {

                    });
            },
            getPaymentMethods: function () {
                const self = this;

                let url = `${process.env.apiServerUrl}/api/v1/s/payment_method/merchant`;

                axios.get(url, {headers: { Authorization: `Bearer ${this['$store'].state.user.accessToken}` }})
                    .then(function (response) {
                        if (!response.hasOwnProperty('data')) {
                            return;
                        }

                        for (let key in response.data) {
                            if (!response.data.hasOwnProperty(key)) {
                                continue;
                            }

                            self.paymentMethods.push({value: key, label: response.data[key] });
                        }
                    }).catch(function (e) {

                    });
            },
            onCountrySearch: function (search) {
                const self = this;

                let url = `${process.env.apiServerUrl}/api/v1/country`;

                if (search.length > 0) {
                    url += `?name=${search}`;
                }

                axios.get(url)
                    .then(function (response) {
                        if (response.data.length <= 0) {
                            return;
                        }

                        self.countries = [];

                        for (let i = 0; i < response.data.length; i++) {
                            let item = response.data[i];

                            self.countries.push({label: item['name']['en'], value: item['code_a2']});
                        }
                    }).catch(function () {});
            },
            search: function () {
                let filters = {};

                if (this.values.id != null && this.values.id.length > 0) {
                    filters['id'] = this.values.id;
                }

                if (this.values.account != null && this.values.account.length > 0) {
                    filters['account'] = this.values.account;
                }

                if (this.values.account != null && this.values.account.length > 0) {
                    filters['account'] = this.values.account;
                }

                if (this.values.createDate != null && Array.isArray(this.values.createDate)) {
                    filters['project_date_from'] = this.values.createDate[0].getTime()/1000;
                    filters['project_date_to'] = this.values.createDate[1].getTime()/1000;
                }

                if (this.values.paidDate != null && Array.isArray(this.values.paidDate)) {
                    filters['pm_date_from'] = this.values.paidDate[0].getTime()/1000;
                    filters['pm_date_to'] = this.values.paidDate[1].getTime()/1000;
                }

                if (this.values.country != null && Array.isArray(this.values.country)) {
                    filters['country'] = [];

                    for (let i = 0; i < this.values.country.length; i++) {
                        filters['country'].push(this.values.country[i].value);
                    }
                }

                if (this.values.project != null && Array.isArray(this.values.project)) {
                    filters['project'] = [];

                    for (let i = 0; i < this.values.project.length; i++) {
                        filters['project'].push(this.values.project[i].value);
                    }
                }

                if (this.values.paymentMethod != null && Array.isArray(this.values.paymentMethod)) {
                    filters['payment_method'] = [];

                    for (let i = 0; i < this.values.paymentMethod.length; i++) {
                        filters['payment_method'].push(this.values.paymentMethod[i].value);
                    }
                }

                if (this.values.status != null && Array.isArray(this.values.status)) {
                    filters['status'] = [];

                    for (let i = 0; i < this.values.status.length; i++) {
                        filters['status'] = [...this.filters['status'], ...this.oStatuses[this.values.status[i]]];
                    }
                }

                this.$emit('onSearch', filters);
            }
        },
        mounted: function () {
            this.getProjects();
            this.getPaymentMethods();
            this.onCountrySearch('');

            const query = this['$route']['query'];

            if (Object.keys(query).length > 0 && query.hasOwnProperty('pm_date_from')
                && query.hasOwnProperty('pm_date_to')) {
                let filters = {
                    'pm_date_from': query['pm_date_from'],
                    'pm_date_to': query['pm_date_to']
                };

                this.$emit('onSearch', filters);
            }


        }
    }
</script>

<style lang="scss">
    .search-container {
        position: relative;

        .btn-filters {
            position: absolute;
            top: -35px;
            right: 10px;

            &.hide {
                top: -60px;
            }
        }

        .search-panel-container {
            position: relative;
            padding: 10px 15px;
            margin-top: -25px;
            background-color: #ffffff;

            &.hide {
                display: none;
            }
            &.show {
                display: block;
            }

            .mx-shortcuts-wrapper {
                font-size: 12px;
                line-height: 20px !important;
                padding: 12px !important;

                .mx-shortcuts {
                    display: inline-block;
                    border: 1px solid #73879c;
                    border-radius: 3px;
                    color: #73879c;;
                    padding: 5px 10px;
                    margin: 5px;

                    &:after {
                        display: none;
                    }
                }
            }
        }
    }
</style>