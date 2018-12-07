<template>
    <div style="width: 100%;">
        <order-search-panel @onOrdersLoaded="onOrdersLoaded"></order-search-panel>

        <div class="col-12">
            <order-item-list :count="count" :items="items"></order-item-list>
        </div>
    </div>
</template>

<script>
    import OrderSearchPanel from '../../components/OrderSearchPanel';
    import OrderItemList from '../../components/OrderItemList';

    export default {
        middleware: 'IsNotAuthenticated',
        components: {OrderSearchPanel, OrderItemList},
        data: function () {
            return {
                count: 0,
                items: [],
            }
        },
        methods: {
            onChangeCountry: function (val) {

            },
            onOrdersLoaded: function (count, items) {
                this.count = count;
                this.items = items;
            }
        }
    }
</script>