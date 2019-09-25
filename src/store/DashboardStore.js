import axios from 'axios';
import qs from 'qs';
import { camelCase, get, upperCase } from 'lodash-es';

function getDefaultPeriod(type) {
  return {
    base: 'current_month',
    main: 'current_month',
  }[type];
}

function timeShiftByPeriod(period) {
  const hour = 3600000;
  const eightHours = hour * 8;
  const day = eightHours * 3;
  const threeDays = day * 3;
  const halfMonth = threeDays * 5;

  return {
    // One hour
    current_day: hour,
    previous_day: hour,
    // 8 hours
    current_week: eightHours,
    previous_week: eightHours,
    // One day
    current_month: day,
    previous_month: day,
    // three days
    current_quarter: threeDays,
    previous_quarter: threeDays,
    // half of month
    current_year: halfMonth,
    previous_year: halfMonth,
  }[period];
}

function timePeriod(period) {
  const now = (new Date()).getTime();
  const day = 86400000;
  const week = day * 7;
  const month = day * 30;
  const quarter = day * 91;
  const year = day * 365;

  return {
    current_day: [now - day, now],
    previous_day: [now - day * 2, now - day],
    current_week: [now - week, now],
    previous_week: [now - week * 2, now - week],
    current_month: [now - month, now],
    previous_month: [now - month * 2, now - month],
    current_quarter: [now - quarter, now],
    previous_quarter: [now - quarter * 2, now - quarter],
    current_year: [now - year, now],
    previous_year: [now - year * 2, now - year],
  }[period];
}

export default function createContactsStore() {
  return {
    namespaced: true,
    state: {
      base: null,
      main: null,
      revenue: null,
      currency: 'USD',
      basePeriod: getDefaultPeriod('base'),
      mainPeriod: getDefaultPeriod('main'),
      lastPayments: [],
    },
    getters: {
      revenueChartPeriod(state) {
        const timeShift = timeShiftByPeriod(state.mainPeriod);
        const period = timePeriod(state.mainPeriod);

        return {
          min: period[0] - timeShift,
          max: period[1] + timeShift,
        };
      },
      baseChartPeriod(state) {
        const timeShift = timeShiftByPeriod(state.basePeriod);
        const period = timePeriod(state.basePeriod);

        return {
          min: period[0] - timeShift,
          max: period[1] + timeShift,
        };
      },
    },
    actions: {
      async initState({ commit, dispatch }) {
        const baseStoragePeriod = localStorage ? localStorage.getItem('BASE_PERIOD') : null;
        const basePeriod = JSON.parse(baseStoragePeriod) || getDefaultPeriod('base');

        const mainStoragePeriod = localStorage ? localStorage.getItem('MAIN_PERIOD') : null;
        const mainPeriod = JSON.parse(mainStoragePeriod) || getDefaultPeriod('main');

        commit('basePeriod', basePeriod);
        commit('mainPeriod', mainPeriod);

        await dispatch('fetchChart', 'main');
        await dispatch('fetchChart', 'revenue_dynamics');
        await dispatch('fetchChart', 'base');
        await dispatch('fetchLastPayments');
      },
      async fetchChart({
        commit,
        state,
        rootState,
        rootGetters,
      }, type) {
        const isOnboardingComplete = rootGetters['User/Merchant/isOnboardingComplete'];
        const { accessToken, Merchant } = rootState.User;
        const merchantId = Merchant.merchant.id;

        if (!merchantId || !isOnboardingComplete) {
          return;
        }

        const { apiUrl } = rootState.config;
        const period = state[`${type}Period`] || state.mainPeriod;
        const queryString = qs.stringify({ period });

        const response = await axios.get(
          `${apiUrl}/admin/api/v1/merchants/${merchantId}/dashboard/${type}?${queryString}`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );

        if (response.data) {
          commit(camelCase(type), response.data);
        }
      },
      async changePeriod({ commit, dispatch }, { type, period }) {
        commit(`${type}Period`, period);

        if (type === 'base') {
          await dispatch('fetchChart', 'base');
        }
        if (type === 'main') {
          await dispatch('fetchChart', 'main');
          await dispatch('fetchChart', 'revenue_dynamics');
        }

        localStorage.setItem(`${upperCase(type)}_PERIOD`, JSON.stringify(period));
      },
      async fetchLastPayments({ commit, rootState }, count = 30) {
        const { accessToken, Merchant } = rootState.User;
        const merchantId = Merchant.merchant.id;

        if (!merchantId) {
          return;
        }

        const { apiUrl } = rootState.config;
        const queryString = qs.stringify({
          merchant: [merchantId],
          sort: ['-created_at'],
          limit: count,
        });

        const response = await axios.get(
          `${apiUrl}/admin/api/v1/order?${queryString}`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );

        if (response.data) {
          commit('lastPayments', response.data.items);
        }
      },
    },
    mutations: {
      base(state, data) {
        state.base = data;
      },
      main(state, data) {
        state.main = data;
      },
      revenueDynamics(state, data) {
        state.revenue = get(data, 'items', []);
        state.currency = get(data, 'currency', 'USD');
      },
      basePeriod(state, data) {
        state.basePeriod = data;
      },
      mainPeriod(state, data) {
        state.mainPeriod = data;
      },
      lastPayments(state, data) {
        state.lastPayments = data;
      },
    },
  };
}
