import axios from 'axios';
import Centrifuge from 'centrifuge';
import HelloSign from 'hellosign-embedded';

const HELLOSIGN_CLIENT_ID = '3555849b464426e6acbaa93482b7a847';

export default function createLicenseAgreementStore() {
  return {
    namespaced: true,
    state: () => ({
      helloSign: null,
      signature: null,
      isSigendYou: false,
      isSigendPS: false,
      isReject: false,
      // TODO: remove test data (@see https://protocol1.atlassian.net/browse/PAY-440)
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
      async initState({ commit, dispatch }) {
        try {
          await dispatch('fetchAgreementSignature');

          const helloSign = new HelloSign({
            clientId: HELLOSIGN_CLIENT_ID,
            // TODO: remove 3 lines below for production
            testMode: true,
            debug: true,
            skipDomainVerification: true,
          });

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
        console.error(rootState);
        const { accessToken, Merchant } = rootState.User;
        const merchantId = Merchant.merchant.id;

        const response = await axios.put(
          `${rootState.config.apiUrl}/admin/api/v1/merchants/${merchantId}/agreement/signature`,
          { singer_type: 0 },
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );

        commit('signature', response.data);
      },
      openLicense({ state }) {
        state.helloSign.open(state.signature.signing_url);
      },
      initWaitingForDocumentSigned({ commit, rootState }) {
        const centrifuge = new Centrifuge(rootState.config.websocketUrl);
        const { merchant } = rootState.User.Merchant;

        centrifuge.setToken(merchant.centrifugo_token);
        centrifuge.subscribe(`paysuper:merchant#${merchant.id}`, ({ data }) => {
          if (data.code === 'ds000003') {
            commit('isReject', true);
            commit('isSigendYou', false);
            commit('isSigendPS', false);

            return;
          }

          if (data.code === 'mr000018') {
            commit('isSigendPS', true);
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
