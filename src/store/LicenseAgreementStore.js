import axios from 'axios';
import Centrifuge from 'centrifuge';
import HelloSign from 'hellosign-embedded';

export default function createLicenseAgreementStore() {
  return {
    namespaced: true,
    state: () => ({
      helloSign: null,
      signature: null,
      isSigendYou: false,
      isSigendPS: false,
      isReject: false,
      // Test filedata
      file: {
        name: 'License Agreement.pdf',
        link: '#',
      },
    }),
    mutations: {
      isSigendYou(state, data) {
        state.isSigendYou = data;
      },
      isSigendPS(state, data) {
        state.isSigendPS = data;
      },
      helloSign(state, data) {
        state.helloSign = data;
      },
      signature(state, data) {
        state.signature = data;
      },
    },
    actions: {
      async initState({ commit, dispatch, state }) {
        try {
          await dispatch('fetchAgreementSignature');

          const helloSign = new HelloSign({ clientId: state.signature.client_id });

          helloSign.on('sign', () => {
            commit('isSigendYou', true);
            dispatch('initWaitingForDocumentSigned');
          });

          commit('helloSign', helloSign);
        } catch (error) {
          console.warn(error);
        }
      },
      async fetchAgreementSignature({ commit, rootState }) {
        const { accessToken, Merchant } = rootState.User;
        const merchantId = Merchant.merchant.id;

        const response = await axios.get(
          `${rootState.config.apiUrl}/admin/api/v1/merchants/${merchantId}/agreement/signature`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );

        commit('signature', response.data);
      },
      openLicense({ state }) {
        state.helloSign.open(state.signature.signing_url, {
          redirectTo: state.signature.signing_redirect_url,
        });
      },
      initWaitingForDocumentSigned({ commit, state, rootState }) {
        const centrifuge = new Centrifuge(rootState.config.websocketUrl);
        centrifuge.setToken(state.profile.centrifugo_token);
        centrifuge.subscribe(`paysuper:merchant#${rootState.Merchant.merchant.id}`, ({ data }) => {
          if (data.isReject) {
            commit('isReject', true);
            commit('isSigendYou', false);
            commit('isSigendPS', false);
            return;
          }

          commit('isSigendPS', true);
        });
        centrifuge.connect();
      },
    },
  };
}
