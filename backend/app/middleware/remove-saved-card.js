
const axios = require('axios');
const webappConfig = require('../../config/webappConfig');

const userIdentityCookieName = '_ps_ctkn';

module.exports = async function removeSavedCard(ctx) {
  const { apiUrl } = webappConfig;
  const { id } = ctx.request.body;
  const cookie = ctx.cookies.get(userIdentityCookieName);
  try {
    await axios.delete(
      `${apiUrl}/saved_card`,
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
