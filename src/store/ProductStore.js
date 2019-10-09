import axios from 'axios';

function mapDataApiToForm(data) {
  return data;
}

export default function createProductStore() {
  return {
    state: () => ({
      projectId: null,
      productId: null,
      product: null,
    }),

    mutations: {
      projectId(store, data) {
        store.projectId = data;
      },
      productId(store, data) {
        store.productId = data;
      },
      product(store, data) {
        store.product = data;
      },
    },

    actions: {
      async initState({ commit, dispatch }, { projectId = null, productId }) {
        commit('projectId', projectId);
        if (productId === 'new') {
          commit('product', {
            object: 'product',
            type: 'simple_product',
            sku: 'ru_0_gta_31',
            name: {
              en: 'GTA 3',
            },
            default_currency: 'USD',
            enabled: true,
            prices: [
              {
                amount: 101,
                currency: 'USD',
              },
            ],
            description: {
              en: 'GTA 3 description',
            },
            long_description: {},
            project_id: '5be2e16701d96d00012d26c3',
          });
        } else {
          commit('productId', productId);
          await dispatch('fetchProduct');
        }
      },

      async createProduct({
        state, commit, rootState,
      }) {
        const response = await axios.post(
          `${rootState.config.apiUrl}/admin/api/v1/products/${state.productId}`,
          state.product,
        );
        commit('product', mapDataApiToForm(response.data));
      },

      async fetchProduct({
        state, commit, rootState,
      }) {
        const response = await axios.get(
          `${rootState.config.apiUrl}/admin/api/v1/products/${state.productId}`,
        );
        commit('product', mapDataApiToForm(response.data));
      },

      async updateProduct({
        state, commit, rootState,
      }) {
        const response = await axios.put(
          `${rootState.config.apiUrl}/admin/api/v1/products/${state.productId}`,
          state.product,
        );
        commit('product', response.data);
      },
    },

    namespaced: true,
  };
}
