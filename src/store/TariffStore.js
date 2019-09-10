import axios from 'axios';
import { camelCase, upperFirst } from 'lodash-es';
import qs from 'qs';
import getCountriesByRegion from '@/helpers/getCountriesByRegion';

function prepareRegionData(region, data) {
  const regions = {
    north_america: { defaultCurrency: 'USD', label: 'North America', abbreviation: 'NA' },
    eu: { defaultCurrency: 'EUR', label: 'European Union', abbreviation: 'EU' },
    uk: { defaultCurrency: 'GBP', label: 'United Kingdom', abbreviation: 'UK' },
    russia: { defaultCurrency: 'RUB', label: 'Russia', abbreviation: 'RU' },
    worldwide: { defaultCurrency: 'USD', label: 'Worldwide', abbreviation: 'WW' },
  };

  const payment = data.payment || [];
  const refund = data.money_back || [];
  const chargeback = data.chargeback || [];
  const payout = data.payout || [];

  return {
    ...regions[region],
    countries: getCountriesByRegion(region),
    channelCosts: payment.map(item => ({
      method: item.method,
      icon: `Icon${upperFirst(camelCase(item.method))}`,
      methodFee: item.method_percent_fee,
      fixedFee: item.method_fixed_fee,
      overallFee: item.ps_percent_fee,
      psGeneralFixedFee: item.ps_fixed_fee,
    })),
    refundCosts: refund.map(item => ({
      method: item.method,
      icon: `Icon${upperFirst(camelCase(item.method))}`,
      refundFee: item.percent_fee,
      refundFixedFee: item.fixed_fee,
      payoutParty: item.is_paid_by_merchant ? 'Merchant' : 'Pay Super',
    })),
    chargeback: {
      fee: chargeback.fixed_fee,
      payoutParty: chargeback.is_paid_by_merchant ? 'Merchant' : 'Pay Super',
    },
    payout: {
      fee: payout.fixed_fee,
      payoutParty: payout.is_paid_by_merchant ? 'Merchant' : 'Pay Super',
    },
  };
}

export default function createTariffStore() {
  return {
    namespaced: true,
    state: {
      amount: '0.75-5',
      currency: 'USD',
      channelCostsRegion: 'north_america',
      refundCostsRegion: 'north_america',
      region: 'north_america',
      regions: [],
    },
    getters: {},
    mutations: {
      amount(state, data) {
        state.amount = data;
      },
      currency(state, data) {
        state.currency = data;
      },
      channelCostsRegion(state, data) {
        state.channelCostsRegion = data;
      },
      refundCostsRegion(state, data) {
        state.refundCostsRegion = data;
      },
      region(state, data) {
        state.region = data;
      },
      regions(state, data) {
        state.regions = data;
      },
    },
    actions: {
      async initState({ dispatch, state }) {
        await dispatch('fetchTariffs', state.region);
      },
      async fetchTariffs({ commit, state, rootState }, region) {
        if (state.regions[region]) {
          return;
        }

        const { accessToken } = rootState.User;
        const amount = state.amount.split('-');
        const queryString = qs.stringify({
          region,
          payout_currency: state.currency,
          amountFrom: amount[0],
          amountTo: amount[1],
        });

        const response = await axios.get(
          `${rootState.config.apiUrl}/admin/api/v1/merchants/tariffs?${queryString}`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );

        if (response.data) {
          commit('regions', { ...state.regions, [region]: prepareRegionData(region, response.data) });
        }
      },
      async submitTariffs({ dispatch, state, rootState }) {
        const { accessToken, Merchant } = rootState.User;
        const merchantId = Merchant.merchant.id;
        const amount = state.amount.split('-');

        const response = await axios.post(
          `${rootState.config.apiUrl}/admin/api/v1/merchants/${merchantId}/tariffs`,
          {
            region: state.region,
            payout_currency: state.currency,
            amount_from: amount[0],
            amount_to: amount[1],
          },
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );

        if (response.data) {
          dispatch('User/Merchant/completeStep', 'tariff', { root: true });
          return true;
        }

        return false;
      },
      updateRegion({ commit, dispatch }, region) {
        commit('region', region);
        dispatch('fetchTariffs', region);
      },
      updateCurrency({ commit }, currency) {
        commit('currency', currency);
      },
      updateChannelCostsRegion({ commit, dispatch }, region) {
        commit('channelCostsRegion', region);
        dispatch('fetchTariffs', region);
      },
      updateRefundCostsRegion({ commit, dispatch }, region) {
        commit('refundCostsRegion', region);
        dispatch('fetchTariffs', region);
      },
      updateAmount({ commit }, amount) {
        commit('amount', amount);
      },
    },
  };
}
