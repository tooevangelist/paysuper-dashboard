module.exports = {
  ownBackendUrl: {
    name: 'VUE_APP_BACKEND_DOMAIN',
    default: 'http://localhost:8080',
  },
  apiUrl: {
    name: 'VUE_APP_P1PAYAPI_URL',
    default: 'https://p1payapi.tst.protocol.one',
  },
  hellosignClientId: {
    name: 'HELLOSIGN_CLIENT_ID',
    default: '2599245f066de53be8e5837360edf3ac',
  },
  hellosignTestMode: {
    name: 'HELLO_SIGN_TEST_MODE',
    default: true,
  },
  websocketUrl: {
    name: 'VUE_APP_WEBSOCKET_URL',
    default: 'wss://cf.tst.protocol.one/connection/websocket',
  },
  paysuperJsSdkUrl: {
    name: 'PAYSUPER_JS_SDK_URL',
    default: 'https://static.protocol.one/paysuper/sdk/dev/paysuper.js',
  },
};
