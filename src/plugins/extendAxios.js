import axios from 'axios';
import { get } from 'lodash-es';

export default function extendAxios(store) {
  const createSetAuthInterceptor = state => (config) => {
    const accessToken = get(state, 'User.accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  };

  const setAuthCb = createSetAuthInterceptor(store.state);
  axios.interceptors.request.use(setAuthCb);
}
