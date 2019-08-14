import axios from 'axios';

export default function createContactsStore() {
  return {
    namespaced: true,
    state: {
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
    },
    getters: {
      contacts(state) {
        const { contacts } = state;
        const [authFirstName, authLastName] = contacts.authorized.name.split(' ');
        const [techFirstName, techLastName] = contacts.technical.name.split(' ');

        return {
          authorized: {
            firstName: authFirstName,
            lastName: authLastName,
            ...contacts.authorized,
          },
          technical: {
            firstName: techFirstName,
            lastName: techLastName,
            ...contacts.technical,
          },
        };
      },
    },
    mutations: {
      contacts(state, data) {
        state.contacts = data;
      },
    },
    actions: {
      async initState({ commit, rootState }) {
        const { contacts } = rootState.User.Merchant.merchant;

        if (contacts) {
          commit('contacts', contacts);
        }
      },
      async submitContacts({ state, rootState }) {
        const { accessToken, Merchant } = rootState.User;
        const merchantId = Merchant.merchant.id;

        await axios.put(
          `${rootState.config.apiUrl}/admin/api/v1/merchants/${merchantId}/contacts`,
          { ...state.contacts },
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
      },
      updateContacts({ commit }, contacts) {
        const authName = `${contacts.authorized.firstName} ${contacts.authorized.lastName}`;
        const techName = `${contacts.technical.firstName} ${contacts.technical.lastName}`;

        commit('contacts', {
          authorized: {
            name: authName,
            ...contacts.authorized,
          },
          technical: {
            name: techName,
            ...contacts.technical,
          },
        });
      },
    },
  };
}
