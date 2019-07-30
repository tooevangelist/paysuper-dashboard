const _ = require('lodash');
const webappConfigScheme = require('./webappConfigScheme.js');
const envUtils = require('../app/utils/env');

const { getEnvVariable } = envUtils;

module.exports = _.mapValues(webappConfigScheme, item => getEnvVariable(item.name, item.default));
