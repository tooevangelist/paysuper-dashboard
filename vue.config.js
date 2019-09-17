const _ = require('lodash');
const path = require('path');
const aliasesConfig = require('./aliases.config');
const webappConfigScheme = require('./backend/config/webappConfigScheme.js');

module.exports = {
  css: {
    extract: false,
    // loaderOptions: {
    //   sass: {
    //     data: `
    //       @import "@/assets/styles/gui.scss";
    //       @import "@/assets/styles/mixins.scss";
    //     `,
    //   },
    // },
  },

  configureWebpack: {
    entry: [
      'core-js/modules/es.promise',
      'core-js/modules/es.string.includes',
      'core-js/modules/es.array.iterator',
      path.resolve(__dirname, 'src/main.js'),
    ],
    resolve: {
      alias: aliasesConfig.webpack,
    },
  },

  chainWebpack: (config) => {
    config.module
      .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use('i18n')
      .loader('@kazupon/vue-i18n-loader');
  },

  pluginOptions: {
    lintStyleOnBuild: false,
    stylelint: {},
    i18n: {
      locale: 'ru',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true,
    },
  },

  devServer: {
    port: 3030,

    before(app) {
      app.get('/conf', (req, res) => {
        const result = _.mapValues(
          webappConfigScheme, item => process.env[item.name] || item.default,
        );
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      });
    },
  },
};
