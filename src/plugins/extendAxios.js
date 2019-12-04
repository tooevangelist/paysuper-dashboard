import axios from 'axios';
import { get } from 'lodash-es';
import { showErrorMessage } from '@/helpers/notifications';

export default function extendAxios(store, router) {
  const createSetAuthInterceptor = () => (config) => {
    config.url = config.url
      .replace(/^{apiUrl}/, store.state.config.apiUrl)
      .replace(/^{ownBackendUrl}/, store.state.config.ownBackendUrl);

    if (!config.url.includes('/api/v1')) {
      return config;
    }
    const accessToken = get(store.state, 'User.accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  };
  const setAuthCb = createSetAuthInterceptor();
  axios.interceptors.request.use(setAuthCb);

  let refreshTokenPromise;
  const createUpdateAuthInterceptor = http => async (error) => {
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }
    if (!refreshTokenPromise) {
      refreshTokenPromise = store.dispatch('User/refreshToken');
    }
    try {
      await refreshTokenPromise;
      refreshTokenPromise = null;
      return http(error.config);
    } catch {
      // Request may fail with 401 on route enter which will cause setPageError behaviour
      // We need to make sure the redirect is executed AFTER the route with 401 is finised
      // Otherwise new page will have PageError contents
      setTimeout(() => {
        showErrorMessage('Access token is expired. Please log in again.');
        router.push({ path: '/' });
      }, 1);
      refreshTokenPromise = null;
      return Promise.reject(error);
    }
  };
  const updateAuthCb = createUpdateAuthInterceptor(axios);
  axios.interceptors.response.use(null, updateAuthCb);
}
