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
            ...contacts.authorized,
            firstName: authFirstName || '',
            lastName: authLastName || '',
          },
          technical: {
            ...contacts.technical,
            firstName: techFirstName || '',
            lastName: techLastName || '',
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
      async submitContacts({ dispatch, state, rootState }) {
        const { accessToken } = rootState.User;

        const response = await axios.put(
          `${rootState.config.apiUrl}/admin/api/v1/merchants/contacts`,
          { ...state.contacts },
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );

        if (response.data) {
          dispatch('User/Merchant/completeStep', 'contacts', { root: true });
          return true;
        }

        return false;
      },
      updateContacts({ commit }, contacts) {
        const authFirstName = contacts.authorized.firstName || '';
        const techFirstName = contacts.technical.firstName || '';
        const authLastName = contacts.authorized.lastName || '';
        const techLastName = contacts.technical.lastName || '';
        const authName = `${authFirstName}${authLastName && ` ${authLastName}`}`;
        const techName = `${techFirstName}${techLastName && ` ${techLastName}`}`;

        commit('contacts', {
          authorized: {
            ...contacts.authorized,
            name: authName || '',
          },
          technical: {
            ...contacts.technical,
            name: techName || '',
          },
        });
      },
    },
  };
}
