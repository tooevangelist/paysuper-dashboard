import axios from 'axios';
import {
  groupBy,
  map,
  sortBy,
  upperFirst,
} from 'lodash-es';
import getIconByPaymentMethod from '@/helpers/getIconByPaymentMethod';

function prepareChannelCosts(data) {
  return groupBy(
    sortBy(
      map(data, item => ({
        method: upperFirst(item.name),
        icon: getIconByPaymentMethod(item.name),
        methodFee: item.method_percent,
        fixedFee: item.method_fix_amount,
        fixedFeeCurrency: item.method_fix_amount_currency,
        overallFee: item.ps_percent,
        psGeneralFixedFee: item.ps_fixed_fee,
        psGeneralFixedFeeCurrency: item.ps_fixed_fee_currency,
        payoutCurrency: item.payout_currency,
        amount: item.min_amount,
        country: item.country,
        region: item.region,
      })),
      ['amount', 'region', 'country'],
    ),
    'method',
  );
}
function prepareMoneyBack(data) {
  const moneyBack = groupBy(
    sortBy(
      map(data, item => ({
        method: upperFirst(item.name),
        icon: getIconByPaymentMethod(item.name),
        methodFee: item.percent,
        fixedFee: item.fix_amount,
        fixedFeeCurrency: item.fix_amount_currency,
        payoutCurrency: item.payout_currency,
        payoutParty: item.is_paid_by_merchant ? 'Merchant' : 'PaySuper',
        country: item.country,
        region: item.region,
        type: item.undo_reason,
      })),
      ['method', 'region', 'country'],
    ),
    'type',
  );

  return {
    chargeback: moneyBack.chargeback,
    refundCosts: groupBy(moneyBack.reversal, 'method'),
  };
}

export default function createMerchantTariffStore() {
  return {
    namespaced: true,
    state: {
      channelCosts: {},
      chargeback: [],
      refundCosts: {},
    },
    getters: {},
    mutations: {
      channelCosts(state, data) {
        state.channelCosts = data;
      },
      chargeback(state, data) {
        state.chargeback = data;
      },
      refundCosts(state, data) {
        state.refundCosts = data;
      },
    },
    actions: {
      async initState({ dispatch }, merchantId) {
        await Promise.all([
          dispatch('fetchChannelCosts', merchantId),
          dispatch('fetchMoneyBack', merchantId),
        ]);
      },
      async fetchChannelCosts({ commit }, merchantId) {
        const response = await axios.get(
          `{apiUrl}/admin/api/v1/payment_costs/channel/merchant/${merchantId}/all`,
        );

        if (response.data) {
          const { items = [] } = response.data;
          const channelCosts = prepareChannelCosts(items);

          commit('channelCosts', channelCosts);
        }
      },
      async fetchMoneyBack({ commit }, merchantId) {
        const response = await axios.get(
          `{apiUrl}/admin/api/v1/payment_costs/money_back/merchant/${merchantId}/all`,
        );

        if (response.data) {
          const { items = [] } = response.data;
          const { chargeback, refundCosts } = prepareMoneyBack(items);

          commit('chargeback', chargeback);
          commit('refundCosts', refundCosts);
        }
      },
    },
  };
}
