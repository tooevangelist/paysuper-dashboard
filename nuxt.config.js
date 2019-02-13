require('dotenv').config();
const webpack = require('webpack');

module.exports = {
  /*
  ** Headers of the page
  */
  env: {
    authServerUrl: process.env.P1AUTH_URL,
    socialNetworks: {
      facebook: { icon: 'fa-facebook' },
      vkontakte: { icon: 'fa-vk' },
      odnoklassniki: { icon: 'fa-odnoklassniki' },
    },
    apiServerUrl: process.env.P1PAYAPI_URL,
    apiProjectIdentifier: process.env.P1PAYAPI_PROJECT_IDENTIFIER,
  },
  head: {
    title: 'PonePay',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'PONE payment solution customer control panel' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  },
  css: [
    { src: 'font-awesome/scss/font-awesome.scss', lang: 'scss' },
    { src: '@/assets/scss/style.scss', lang: 'scss' },
    { src: 'vue-multiselect/dist/vue-multiselect.min.css', lang: 'css' },
  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {

    transpile: [
      // /^@protocol-one\/ui-kit\/?((?!node_modules).)*$/,
      /@protocol-one\/ui-kit/,
      /lodash-es/,
      /vuejs-datepicker/,
    ],

    /*
    ** Run ESLint on save
    */
    extend(config, { isDev }) {
      if (isDev && process.client) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        });
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        jQuery: 'jquery',
        $: 'jquery',
        'window.jQuery': 'jquery',
      }),
    ],
  },
  modules: [
    '@nuxtjs/toast',
    '@nuxtjs/moment',
    ['bootstrap-vue/nuxt', { css: false }],
  ],
  plugins: [
    { src: '~/plugins/vue-select', ssr: false },
    { src: '~/plugins/vue-datepicker', ssr: false },
    { src: '~/plugins/vue-multiselect', ssr: false },
  ],
  vendor: ['axios', 'jquery', 'vue-select', 'vue2-datepicker', 'vue-multiselect'],
};

