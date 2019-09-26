import axios from 'axios';
import qs from 'qs';
import { camelCase, get, upperCase } from 'lodash-es';
import {
  getTime,
  getDaysInMonth,
  getDaysInYear,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
} from 'date-fns';

function getDefaultPeriod(type) {
  return {
    base: 'current_month',
    main: 'current_month',
  }[type];
}

function timeShiftByPeriod(period) {
  const hour = 3600000;
  const day = hour * 24;
  const threeDays = day * 3;
  const week = day * 7;
  const month = day * 30;

  return {
    // One hour
    current_day: hour * 6,
    previous_day: hour * 6,
    // 8 hours
    current_week: day,
    previous_week: day,
    // One day
    current_month: threeDays,
    previous_month: threeDays,
    // three days
    current_quarter: week,
    previous_quarter: week,
    // half of month
    current_year: month,
    previous_year: month,
  }[period];
}

function timePeriod(period) {
  const now = getTime(new Date());
  const day = 86400000;
  const week = day * 7;
  const month = day * getDaysInMonth(now);
  const quarter = day * 91;
  const year = day * getDaysInYear(now);

  return {
    current_day: [getTime(startOfDay(now)), now],
    previous_day: [getTime(startOfDay(now - day)), getTime(endOfDay(now - day))],
    current_week: [getTime(startOfWeek(now)), now],
    previous_week: [getTime(startOfWeek(now - week)), getTime(endOfWeek(now - week))],
    current_month: [getTime(startOfMonth(now)), now],
    previous_month: [getTime(startOfMonth(now - month)), getTime(endOfMonth(now - month))],
    current_quarter: [getTime(startOfQuarter(now)), now],
    previous_quarter: [
      getTime(startOfQuarter(now - quarter)),
      getTime(endOfQuarter(now - quarter)),
    ],
    current_year: [getTime(startOfYear(now)), now],
    previous_year: [getTime(startOfYear(now - year)), getTime(endOfYear(now - year))],
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
      mainChartPeriod(state) {
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
        const currency = get(data, 'currency');

        state.revenue = get(data, 'items', []);

        if (currency) {
          state.currency = get(data, 'currency');
        }
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
