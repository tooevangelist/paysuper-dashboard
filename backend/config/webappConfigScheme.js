module.exports = {
  ownBackendUrl: {
    name: 'VUE_APP_BACKEND_DOMAIN',
    default: '',
  },
  apiUrl: {
    name: 'VUE_APP_P1PAYAPI_URL',
    default: 'https://p1payapi.tst.protocol.one',
  },
  websocketUrl: {
    name: 'VUE_APP_WEBSOCKET_URL',
    default: 'wss://cf.tst.protocol.one/connection/websocket',
  },
};
