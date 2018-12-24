export default {
    methods: {
        getCommission: function (item, key) {
            if (!item.hasOwnProperty(key) || item[key] === null
                || !item.hasOwnProperty('payment_method_amount_income') || item['payment_method_amount_income'] === null) {
                return '&mdash;';
            }

            let val;
            let currency = item['payment_method_amount_income']['currency']['code_a3'];

            if (key === 'vat_amount') {
                val = item[key] + ' ' + currency;
            } else {
                val = item[key]['amount_payment_method_currency'] + ' ' + currency;
            }

            return val;
        },
        getPayout: function (item) {
            if (!item.hasOwnProperty('payment_method_amount_income')
                || item['payment_method_amount_income'] === null) {
                return '&mdash;';
            }

            let val = item['payment_method_amount_income'];

            if (item.hasOwnProperty('vat_amount')) {
                val -= item['vat_amount'];
            }

            if (item.hasOwnProperty('psp_fee') && item['psp_fee'] != null
                && item['psp_fee'].hasOwnProperty('amount_payment_method_currency')) {
                val -= item['psp_fee']['amount_payment_method_currency'];
            }

            if (item.hasOwnProperty('ps_fee_amount') && item['ps_fee_amount'] != null
                && item['ps_fee_amount'].hasOwnProperty('amount_payment_method_currency')) {
                val -= item['ps_fee_amount']['amount_payment_method_currency'];
            }

            return val + ' ' + item['payment_method_amount_income']['currency']['code_a3'];
        },
        getAmount: function (item) {
            let key = 'project_amount_income';

            if (item.hasOwnProperty('project_amount_outcome') && item['project_amount_outcome'] != null
                && item['project_amount_outcome'].hasOwnProperty('amount') && item['project_amount_outcome'] !== null) {
                key = 'project_amount_outcome';
            }

            return item[key]['amount'] + ' ' + item[key]['currency']['code_a3'];
        }
    }
};