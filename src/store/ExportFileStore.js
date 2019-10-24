import axios from 'axios/index';
import Centrifuge from 'centrifuge';

export default function exportFile() {
  return {
    actions: {
      /**
      * Create report file
      * @param state
      * @param params {Object} - {
      *   file_type, // (csv, pdf, xlsx)
      *   report_type, //(vat, vat_transactions, royalty, royalty_transactions, payout)
      *   params: {
      *     id // (document id)
      *   }
      * }
      * @returns {Promise<void>}
      */
      async createReportFile({ rootState }, params) {
        await axios.post(`${rootState.config.apiUrl}/admin/api/v1/report_file`, {
          ...params,
          merchant_id: rootState.User.Merchant.merchant.id,
        });
      },

      initWaitingFile({ rootState }) {
        const centrifuge = new Centrifuge(rootState.config.websocketUrl);
        centrifuge.setToken(rootState.User.Merchant.merchant.centrifugo_token);
        centrifuge.subscribe(`paysuper:user#${rootState.User.Merchant.merchant.id}`, ({ data }) => {
          axios.get(`${rootState.config.apiUrl}/admin/api/v1/report_file/download/${data.file_name}`)
            .then((response) => {
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', data.file_name);
              document.body.appendChild(link);
              link.click();
            });
        });
        centrifuge.connect();
      },
    },

    namespaced: true,
  };
}
