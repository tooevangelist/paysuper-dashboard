
const qs = require('qs');
const axios = require('axios');
const webappConfig = require('../../config/webappConfig');

const userIdentityCookieName = '_ps_ctkn';

module.exports = async function removeSavedCard(ctx) {
  const [, queryString] = ctx.request.url.split('?');
  const query = qs.parse(queryString);
  const apiUrl = query.apiUrl || webappConfig.apiUrl;
  const cookie = ctx.cookies.get(userIdentityCookieName);
  const { id } = ctx.request.body;
  try {
    await axios.delete(
      `${apiUrl}/api/v1/saved_card`,
      {
        data: {
          id,
          cookie,
        },
      },
    );
    return { success: true };
  } catch (error) {
    return { error: error.response.data, success: false };
  }
};
