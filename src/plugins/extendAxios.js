import axios from 'axios';
import { get } from 'lodash-es';

export default function extendAxios(store) {
  const createSetAuthInterceptor = () => (config) => {
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
}
