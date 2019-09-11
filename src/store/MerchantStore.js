import {
  get,
  cloneDeep,
  isEqual,
  size,
  some,
} from 'lodash-es';
import axios from 'axios';
import qs from 'qs';
import mergeApiValuesWithDefaults from '@/helpers/mergeApiValuesWithDefaults';
import { UNAUTHORIZED } from '@/errors';

// const merchantStatues = {
//   draft: 0,
//   agreementRequested: 1,
//   onReview: 2,
//   agreementSigning: 3,
//   agreementSigned: 4,
// };
const merchantAgreementTypes = {
  undefined: 0,
  paper: 1,
  electro: 2,
};

function mapDataApiToForm(data) {
  const defaultData = {
    id: '',
    status: 0,
    created_at: 0,
    updated_at: 0,
    first_payment_at: 0,
    last_payout: {},
    is_signed: false,
    agreement_type: 0,
    agreement_sent_via_mail: false,
    mail_tracking_link: '',
    signature_request: {},
    tariff: {},
    company: {
      address: '',
      address_additional: '',
      alternative_name: '',
      city: '',
      country: '',
      name: '',
      state: '',
      website: '',
      zip: '',
    },
    contacts: {
      authorized: {
        name: '',
        email: '',
        phone: '',
        position: '',
      },
      technical: {
        name: '',
        email: '',
        phone: '',
      },
    },
    banking: {
      account_number: '',
      address: '',
      correspondent_account: '',
      currency: '',
      name: '',
      swift: '',
      details: '',
    },
  };

  const newData = mergeApiValuesWithDefaults(defaultData, data);

  if (newData.country) {
    newData.country = newData.country.code_a2;
  }

  if (newData.banking.currency && newData.banking.currency.code_a3) {
    newData.banking.currency = newData.banking.currency.code_a3;
  }

  return newData;
}

function getDefaultAgreementDocument() {
  return {
    metadata: {
      name: 'Default agreement',
      extension: 'pdf',
      size: '0',
    },
    url: '#',
  };
}

export default function createMerchantStore() {
  return {
    state: () => ({
      merchant: null,
      merchantOriginalCopy: null,
      onboardingCompleteStepsCount: 0,
      merchantStatus: 'draft',
      hasProjects: false,
      onboardingSteps: {
        company: false,
        contacts: false,
        banking: false,
        tariff: false,
      },
      paymentMethods: [],
      paymentMethodsSort: [],
      agreementDocument: getDefaultAgreementDocument(),
    }),

    getters: {
      isMerchantChanged(state) {
        return !isEqual(state.merchant, state.merchantOriginalCopy);
      },
      isOnboardingStepsComplete(state) {
        return size(state.onboardingSteps) === 4
          && !some(state.onboardingSteps, step => step === false);
      },
    },

    mutations: {
      merchant(state, data) {
        state.merchant = data;
        state.merchantOriginalCopy = cloneDeep(data);
      },
      paymentMethods(state, data) {
        state.paymentMethods = data;
      },
      paymentMethodsSort(state, data) {
        state.paymentMethodsSort = data;
      },
      agreementDocument(state, data) {
        state.agreementDocument = data;
      },
      onboardingCompleteStepsCount(state, data) {
        state.onboardingCompleteStepsCount = data;
      },
      merchantStatus(state, data) {
        state.merchantStatus = data;
      },
      onboardingSteps(state, data) {
        state.onboardingSteps = data;
      },
      hasProjects(state, data) {
        state.hasProjects = data;
      },
    },

    actions: {
      async initState({ dispatch }, id) {
        await dispatch('fetchMerchantById', id);
      },

      async fetchMerchantById({ commit, rootState }, id) {
        const response = await axios.get(`${rootState.config.apiUrl}/admin/api/v1/merchants/${id}`, {
          headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
        }).catch(error => console.warn(error));

        commit('merchant', mapDataApiToForm(get(response, 'data', {})));
      },

      async fetchMerchantStatus({ commit, state, rootState }) {
        const merchantId = get(state.merchant, 'id', 0);

        if (merchantId) {
          const response = await axios.get(
            `${rootState.config.apiUrl}/admin/api/v1/merchants/${merchantId}/status`,
            { headers: { Authorization: `Bearer ${rootState.User.accessToken}` } },
          );

          if (response.data) {
            const merchantStatus = get(response, 'data.status', 'draft');
            const stepsCount = get(response, 'data.complete_steps_count', 0);

            commit('onboardingCompleteStepsCount', stepsCount + (merchantStatus === 'life' ? 1 : 0));
            commit('merchantStatus', merchantStatus);
            commit(
              'onboardingSteps',
              get(response, 'data.steps', {
                company: false,
                contacts: false,
                banking: false,
                tariff: false,
              }),
            );
          }
        }
      },

      updateStatus({ commit, state }, status) {
        commit('merchant', { ...state.merchant, status });
        commit('merchantStatus', status > 3 ? 'life' : 'draft');
      },

      /**
       * TODO: after https://protocolone.tpondemand.com/restui/board.aspx?#page=task/191909
       * remove this method and use has_projects attribute from merchant object
       */
      async hasProjects({ state, commit, rootState }) {
        const merchantId = get(state.merchant, 'id', 0);

        if (merchantId) {
          const response = await axios.get(
            `${rootState.config.apiUrl}/admin/api/v1/projects?merchant_id=${merchantId}&limit=1`,
            { headers: { Authorization: `Bearer ${rootState.User.accessToken}` } },
          );

          const hasProjects = Boolean(get(response, 'data.count', 0));

          commit('hasProjects', hasProjects);

          if (hasProjects) {
            commit('onboardingCompleteStepsCount', state.onboardingCompleteStepsCount + 1);
          }
        }
      },

      completeStep({ commit, dispatch, state }, stepName) {
        if (state.onboardingSteps[stepName]) {
          return;
        }
        if (stepName !== 'license') {
          commit('onboardingSteps', {
            ...state.onboardingSteps,
            [stepName]: true,
          });
        }
        commit('onboardingCompleteStepsCount', state.onboardingCompleteStepsCount + 1);

        if (!some(state.onboardingSteps, step => step)) {
          dispatch('fetchMerchant');
        }
      },

      async fetchMerchant({ commit, dispatch, rootState }) {
        const response = await axios.get(`${rootState.config.apiUrl}/admin/api/v1/merchants/user`, {
          headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
        }).catch((error) => {
          const errorCode = get(error, 'response.status');
          if (errorCode === 401) {
            throw UNAUTHORIZED;
          }
          console.warn(error);
        });

        commit('merchant', mapDataApiToForm(get(response, 'data', {})));

        await dispatch('fetchMerchantStatus');
        await dispatch('hasProjects');
      },

      async fetchMerchantPaymentMethods({ state, commit, rootState }, id) {
        const merchantId = id || state.merchant.id;

        const query = qs.stringify({
          sort: state.paymentMethodsSort,
        }, { arrayFormat: 'brackets' });
        const url = `${rootState.config.apiUrl}/admin/api/v1/merchants/${merchantId}/methods?${query}`;

        try {
          const response = await axios.get(
            url,
            {
              headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
            },
          );
          commit('paymentMethods', response.data);
        } catch (error) {
          console.error(error);
        }
      },

      async updateMerchant({ state, commit, rootState }) {
        const response = await axios.put(
          `${rootState.config.apiUrl}/admin/api/v1/merchants`,
          state.merchant,
          {
            headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
          },
        );
        commit('merchant', mapDataApiToForm(response.data));
      },

      async patchMerchant({ state, commit, rootState }, props) {
        const response = await axios.patch(
          `${rootState.config.apiUrl}/admin/api/v1/merchants/${state.merchant.id}`,
          props,
          {
            headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
          },
        );
        commit('merchant', mapDataApiToForm(response.data));
      },

      async changeMerchantAgreement(
        {
          commit, dispatch,
        },
        {
          action, value, message, isPreSigned,
        },
      ) {
        if (action === 'setAgreementType') {
          await dispatch('patchMerchant', { agreement_type: merchantAgreementTypes[value] });
        }

        if (action === 'setStatus') {
          await dispatch('changeMerchantStatus', { status: value, message });
        }

        if (action === 'generateAgreement') {
          await dispatch('changeMerchantStatus', { status: 3 });
          if (isPreSigned) {
            await dispatch('patchMerchant', { has_psp_signature: true });
          }
          await dispatch('fetchAgreement');
        }

        if (action === 'revokeSigning') {
          await dispatch('changeMerchantStatus', { status: 0 });
          commit('agreementDocument', getDefaultAgreementDocument());
        }

        if (action === 'setPspSignature') {
          await dispatch('patchMerchant', { has_psp_signature: value });
        }

        if (action === 'setMerchantSignature') {
          await dispatch('patchMerchant', { has_merchant_signature: value });
        }

        if (action === 'setSentViaEmail') {
          await dispatch('patchMerchant', { agreement_sent_via_mail: value });
        }

        if (action === 'setMailTrackingLink') {
          await dispatch('patchMerchant', { mail_tracking_link: value });
        }
      },

      async changeMerchantStatus({ state, commit, rootState }, { status, message = '' }) {
        const response = await axios.put(
          `${rootState.config.apiUrl}/admin/api/v1/merchants/${state.merchant.id}/change-status`,
          {
            status,
            message,
          },
          {
            headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
          },
        );
        commit('merchant', mapDataApiToForm(response.data));
      },

      async fetchAgreement({ state, commit, rootState }) {
        if (state.merchant.status < 3) {
          commit('agreementDocument', getDefaultAgreementDocument());
          return;
        }

        try {
          const response = await axios.get(
            `${rootState.config.apiUrl}/admin/api/v1/merchants/${state.merchant.id}/agreement`,
            {
              headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
            },
          );

          commit('agreementDocument', response.data);
        } catch (error) {
          console.warn(error);
        }
      },

      async sendNotification({ state, rootState }, notification) {
        await axios.post(
          `${rootState.config.apiUrl}/admin/api/v1/merchants/${state.merchant.id}/notifications`,
          notification,
          {
            headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
          },
        );
      },
    },

    namespaced: true,
  };
}
