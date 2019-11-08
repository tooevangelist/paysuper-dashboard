const fs = require('fs');
const path = require('path');
const qs = require('qs');
const axios = require('axios');
const requestIp = require('request-ip');
const ip6addr = require('ip6addr');
const _ = require('lodash');
const Handlebars = require('handlebars');
const config = require('../../config/config');
const webappConfig = require('../../config/webappConfig');

const orderTemplate = fs.readFileSync(path.resolve('backend/templates/order-page.hbs'), 'utf-8');
const renderOrder = Handlebars.compile(orderTemplate);

const resultTemplate = fs.readFileSync(path.resolve('backend/templates/result-page.hbs'), 'utf-8');
const renderResult = Handlebars.compile(resultTemplate);

const isDev = process.env.NODE_ENV === 'local';
const userIdentityCookieName = '_ps_ctkn';

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

async function getOrderData(apiUrl, orderId, {
  ip, userCookie, acceptLanguage, referer,
}) {
  const { data } = await axios.get(
    `${apiUrl}/api/v1/order/${orderId}`,
    {
      headers: {
        'Accept-Language': acceptLanguage,
        'X-Real-IP': ip,
        'X-Forwarded-For': ip,
        Cookie: `${userIdentityCookieName}=${userCookie}`,
        referer,
      },
    },
  );
  return data;
}

function getIp(request) {
  let ip = '';
  try {
    ip = ip6addr.parse(requestIp.getClientIp(request)).toString({ format: 'v4' });
    // eslint-disable-next-line no-empty
  } catch { }
  return ip;
}

const sdkUrl = isDev ? 'http://localhost:4040/paysuper-form.js' : config.paysuperSdkUrl;

module.exports = async function orderPage(ctx) {
  const [, queryString] = ctx.request.url.split('?');
  const query = qs.parse(queryString);
  const apiUrl = query.apiUrl || webappConfig.apiUrl;
  const ip = getIp(ctx.request);
  const userCookie = ctx.cookies.get(userIdentityCookieName);
  const acceptLanguage = ctx.get('accept-language');
  const referer = ctx.get('referer');

  if (query.debug) {
    return {
      ip,
      acceptLanguage,
      referer,
    };
  }

  if (_.includes(['success', 'fail'], query.result)) {
    return renderResult({
      data: JSON.stringify({
        result: query.result,
      }),
    });
  }

  if (query.loading) {
    return renderOrder({
      data: JSON.stringify({
        orderParams: {},
        orderData: {},
        baseOptions: {
          layout: 'loading',
        },
      }),
      sdkUrl,
    });
  }

  const orderParams = getOrderParams(query);
  let orderData;
  try {
    const orderId = query.order_id || await getOrderId(apiUrl, orderParams);
    const { cookie, ...data } = await getOrderData(apiUrl, orderId, {
      ip, userCookie, acceptLanguage, referer,
    });
    orderData = data;

    // The cookie is required to identify a user. Common use is for saved bank cards
    ctx.cookies.set(userIdentityCookieName, cookie, {
      maxAge: 2592000 * 1000, // 30 days
      httpOnly: true,
      overwrite: true,
    });
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
    orderData = { error: errorData };
  }

  return renderOrder({
    data: JSON.stringify({
      orderParams,
      orderData,
      baseOptions: {
        ...(isDev && query.modal ? { layout: 'modal' } : {}),
      },
    }),
    sdkUrl,
  });
};
