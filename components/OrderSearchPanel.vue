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
                        <input class="form-control" type="text" placeholder="Enter project name"/>
                    </div>

                    <div class="form-group">
                        <label>Project</label>
                        <input class="form-control" type="text" placeholder="Enter project name"/>
                    </div>

                    <div class="form-group">
                        <label>Payment method</label>
                        <input class="form-control" type="text" placeholder="Enter project name"/>
                    </div>
                </div>

                <div class="col">
                    <div class="form-group">
                        <label>Account</label>
                        <input class="form-control" type="text" placeholder="Enter project name"/>
                    </div>

                    <div class="form-group">
                        <label>Country</label>
                        <v-select class="form" id="country" v-bind:options="countries" v-bind:placeholder="'Choose country'"
                                  @search="onCountrySearch" v-bind:onChange="onChangeCountry"
                                  v-model="values.country"></v-select>
                    </div>

                    <div class="form-group">
                        <label>Status</label>
                        <input class="form-control" type="text" placeholder="Enter project name"/>
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
        </div>
    </div>
</template>

<script>
    import Country from '../mixins/country';
    import axios from 'axios';

    export default {
        mixins: [Country],
        data: function () {
            return {
                isShowed: false,
                values: {
                    createDate: '',
                    paidDate: '',
                    country: null
                },
                filters: {},
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
            onChangeCountry: function (val) {

            },
            getOrders: function () {
                const self = this;

                let url = `${process.env.apiServerUrl}/api/v1/s/order`;

                if (Object.keys(this.filters).length > 0) {
                    url += '?' + $.param(this.filters);
                }

                axios.get(url, {headers: { Authorization: `Bearer ${this['$store'].state.user.accessToken}` }})
                    .then(function (response) {
                        if (!response.hasOwnProperty('data') || !response.data.hasOwnProperty('count')
                            || !response.data.hasOwnProperty('items')) {
                            return;
                        }

                        self.$emit('onOrdersLoaded', response.data.count, response.data.items);
                    }).catch(function (e) {

                    });
            }
        },
        created: function () {
            this.getOrders();
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