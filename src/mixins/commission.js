export default {
  methods: {
    getCommission(item, key) {
      if (!item[key] || item[key] === null
        || !item.payment_method_amount_income || item.payment_method_amount_income === null) {
        return '&mdash;';
      }

      let val;
      const currency = item.payment_method_amount_income.currency.code_a3;

      if (key === 'vat_amount') {
        val = `${item[key]} ${currency}`;
      } else {
        val = `${item[key].amount_payment_method_currency} ${currency}`;
      }

      return val;
    },
    getPayout(item) {
      if (!item.payment_method_amount_income
        || item.payment_method_amount_income === null) {
        return '&mdash;';
      }

      let val = item.payment_method_amount_income;

      if (item.vat_amount) {
        val -= item.vat_amount;
      }

      if (item.psp_fee && item.psp_fee != null
        && item.psp_fee.amount_payment_method_currency) {
        val -= item.psp_fee.amount_payment_method_currency;
      }

      if (item.ps_fee_amount && item.ps_fee_amount != null
        && item.ps_fee_amount.amount_payment_method_currency) {
        val -= item.ps_fee_amount.amount_payment_method_currency;
      }

      return `${val} ${item.payment_method_amount_income.currency.code_a3}`;
    },
    getAmount(item) {
      let key = 'project_amount_income';

      if (item.project_amount_outcome && item.project_amount_outcome != null
        && item.project_amount_outcome.amount && item.project_amount_outcome !== null) {
        key = 'project_amount_outcome';
      }

      return `${item[key].amount} ${item[key].currency.code_a3}`;
    },
  },
};
