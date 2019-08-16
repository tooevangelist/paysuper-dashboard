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
      status: 0,
      // TODO: remove test data (@see https://protocol1.atlassian.net/browse/PAY-440)
      file: {
        name: 'License Agreement.pdf',
        link: '#',
      },
    },
    getters: {
      isSigendYou(state) {
        return state.status >= 3;
      },
      isSigendPS(state) {
        return state.status >= 4;
      },
      isUsingHellosign(state) {
        return state.status === 0 || state.isReject;
      },
    },
    mutations: {
      helloSign(state, data) {
        state.helloSign = data;
      },
      signature(state, data) {
        state.signature = data;
      },
      status(state, data) {
        state.status = data;
      },
    },
    actions: {
      async initState({
        commit,
        dispatch,
        getters,
        rootState,
      }) {
        await dispatch('fetchAgreementSignature');

        const { status } = rootState.User.Merchant.merchant;

        commit('status', status);

        if (getters.isUsingHellosign) {
          const helloSign = new HelloSign({
            clientId: HELLOSIGN_CLIENT_ID,
            // TODO: remove 3 lines below for production
            testMode: true,
            debug: true,
            skipDomainVerification: true,
          });

          helloSign.on('sign', () => {
            commit('status', 3);
            dispatch('initWaitingForDocumentSigned');
          });

          commit('helloSign', helloSign);
        }
      },
      async fetchAgreementSignature({ commit, rootState, rootGetters }) {
        const isOnboardingComplete = rootGetters['Company/isOnboardingComplete'];
        const { accessToken, Merchant } = rootState.User;
        const merchantId = get(Merchant, 'merchant.id', 0);

        if (merchantId && isOnboardingComplete) {
          const response = await axios.put(
            `${rootState.config.apiUrl}/admin/api/v1/merchants/${merchantId}/agreement/signature`,
            { singer_type: 0 },
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
      initWaitingForDocumentSigned({ commit, rootState }) {
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
            commit('status', 0);

            return;
          }

          if (data.code === 'mr000018') {
            commit('status', 4);
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
