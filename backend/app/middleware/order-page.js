const fs = require('fs');
const path = require('path');
const qs = require('qs');
const axios = require('axios');
const _ = require('lodash');
const Handlebars = require('handlebars');
const config = require('../../config/config');
const webappConfig = require('../../config/webappConfig');

const orderTemplate = fs.readFileSync(path.resolve('backend/templates/order-page.hbs'), 'utf-8');
const template = Handlebars.compile(orderTemplate);

const isDev = process.env.NODE_ENV === 'local';

function getOrderParams({
  project, token, products, amount, type, currency,
}) {
  return {
    project,
    ...(isDev ? {
      project: '5cc7f1cf790c2900010849ee',
      amount: 25,
      currency: 'USD',
      type: 'simple',
    } : {}),
    ...(token ? { token } : {}),
    ...(products ? { products } : {}),
    ...(amount ? { amount: Number(amount), currency } : {}),
    ...(type ? { type } : {}),
  };
}

async function getOrderId(apiUrl, orderParams) {
  const { data } = await axios.post(
    `${apiUrl}/api/v1/order`,
    orderParams,
  );
  return data.id;
}

async function getOrderData(apiUrl, orderId) {
  const { data } = await axios.get(`${apiUrl}/api/v1/order/${orderId}`);
  return data;
}

const sdkUrl = isDev ? 'http://localhost:4040/paysuper-form.js' : config.paysuperSdkUrl;

module.exports = async function orderPage(ctx) {
  const [, queryString] = ctx.request.url.split('?');
  const query = qs.parse(queryString);
  const apiUrl = query.apiUrl || webappConfig.apiUrl;

  if (query.result) {
    return template({
      result: query.result,
      hasForm: false,
    });
  }

  const baseOptions = {
    ...(query.loading ? { layout: 'loading' } : {}),
    ...(isDev && query.modal ? { layout: 'modal' } : {}),
  };

  if (query.loading) {
    return template({
      data: JSON.stringify({
        orderParams: {},
        orderData: {},
        baseOptions,
      }),
      sdkUrl,
      hasForm: true,
    });
  }

  const orderParams = getOrderParams(query);
  let orderDataRaw;
  try {
    const orderId = query.order_id || await getOrderId(apiUrl, orderParams);
    orderDataRaw = await getOrderData(apiUrl, orderId);
  } catch (error) {
    let errorData = _.get(error, 'response.data');
    if (!errorData) {
      console.error(error);
      errorData = {
        code: 'fm000025',
        message: 'Unknown error. Try request later',
      };
    } else {
      console.error(errorData);
    }
    orderDataRaw = { error: errorData };
  }
  const { cookie, ...orderData } = orderDataRaw;

  // The cookie is required to identify a user. Common use is for saved bank cards
  ctx.cookies.set('_ps_ctkn', cookie, {
    maxAge: 2592000 * 1000, // 30 days
    httpOnly: true,
    overwrite: true,
  });

  return template({
    data: JSON.stringify({
      orderParams,
      orderData,
      baseOptions,
    }),
    sdkUrl,
    hasForm: true,
  });
};
