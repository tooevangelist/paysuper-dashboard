import axios from 'axios';
import { get } from 'lodash-es';
import Centrifuge from 'centrifuge';
import HelloSign from 'hellosign-embedded';

const HELLOSIGN_CLIENT_ID = '2599245f066de53be8e5837360edf3ac';

export default function createLicenseAgreementStore() {
  return {
    namespaced: true,
    state: {
      helloSign: null,
      signature: null,
      isReject: false,
      // TODO: remove test data (@see https://protocol1.atlassian.net/browse/PAY-440)
      file: {
        name: 'License Agreement.pdf',
        link: '#',
      },
    },
    getters: {
      isSigendYou(state, getters) {
        return getters.status >= 3;
      },
      isSigendPS(state, getters) {
        return getters.status >= 4;
      },
      isUsingHellosign(state, getters) {
        return getters.status === 0 || state.isReject;
      },
      status(state, getter, rootState) {
        return rootState.User.Merchant.merchant.status;
      },
    },
    mutations: {
      helloSign(state, data) {
        state.helloSign = data;
      },
      signature(state, data) {
        state.signature = data;
      },
    },
    actions: {
      async initState({ commit, dispatch, getters }) {
        await dispatch('fetchAgreementSignature');

        if (getters.isUsingHellosign) {
          const helloSign = new HelloSign({
            clientId: HELLOSIGN_CLIENT_ID,
            // TODO: remove 3 lines below for production
            testMode: true,
            debug: true,
            skipDomainVerification: true,
          });

          helloSign.on('sign', () => {
            dispatch('User/Merchant/updateStatus', 3, { root: true });
            dispatch('initWaitingForDocumentSigned');
          });

          commit('helloSign', helloSign);
        }
      },
      async fetchAgreementSignature({
        commit,
        getters,
        rootState,
        rootGetters,
      }) {
        const isOnboardingStepsComplete = rootGetters['User/Merchant/isOnboardingStepsComplete'];
        const { accessToken, Merchant } = rootState.User;
        const merchantId = get(Merchant, 'merchant.id', 0);

        if (merchantId && isOnboardingStepsComplete && getters.isUsingHellosign) {
          const response = await axios.put(
            `${rootState.config.apiUrl}/admin/api/v1/merchants/${merchantId}/agreement/signature`,
            { signer_type: 0 },
            { headers: { Authorization: `Bearer ${accessToken}` } },
          );

          commit('signature', response.data);
        }
      },
      openLicense({ state, getters }) {
        if (getters.isUsingHellosign) {
          state.helloSign.open(state.signature.sign_url);
        }
      },
      initWaitingForDocumentSigned({ commit, dispatch, rootState }) {
        const centrifuge = new Centrifuge(rootState.config.websocketUrl);
        const { merchant } = rootState.User.Merchant;

        centrifuge.setToken(merchant.centrifugo_token);
        centrifuge.subscribe(`paysuper:merchant#${merchant.id}`, ({ data }) => {
          /**
           * Data codes
           * ds000001: Document signing failed
           * ds000002: Signer decline document sign
           * ds000003: Paysuper signer decline document sign
           * mr000017: License agreement was signed by merchant
           * mr000018: License agreement was signed by Paysuper admin
           */
          if (data.code === 'ds000003') {
            commit('isReject', true);
            dispatch('User/Merchant/updateStatus', 0, { root: true });

            return;
          }

          if (data.code === 'mr000018') {
            dispatch('User/Merchant/updateStatus', 4, { root: true });
            dispatch('User/Merchant/completeStep', 'license', { root: true });
          }

          /**
           * TODO: create notifications infrastructure for merchant notifications
           * with showing ones' in header
           */
        });
        centrifuge.connect();
      },
    },
  };
}
