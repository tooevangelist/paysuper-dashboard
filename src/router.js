import VueRouter from 'vue-router';
import qs from 'qs';
import { get, kebabCase, find } from 'lodash-es';
import store from './store/RootStore';
import resources from './resources';
import routes from './routes';
import premissions from './schemes/permissionsScheme';
import redirectOnboardedUser from '@/helpers/redirectOnboardedUser';

const router = new VueRouter(
  {
    routes,
    mode: 'history',
    linkActiveClass: 'active',
    parseQuery(query) {
      return qs.parse(query);
    },
    stringifyQuery(query) {
      const result = qs.stringify(query);

      return result ? (`?${result}`) : '';
    },
  },
);

async function registerStoreModule(moduleName, module, initParams) {
  if (!store.state[moduleName]) {
    store.registerModule(moduleName, module(resources));
  }
  return store.dispatch(`${moduleName}/initState`, initParams);
}

/**
 * Handles special class-modificators for html and body tag
 * to allow layout components to change its styles independetly
 */
function updateDocumentClassModificators(to, from) {
  const nameToRemove = kebabCase(get(from, 'meta.layout', 'PageNoLayout'));
  const nameToAdd = kebabCase(get(to, 'meta.layout', 'PageNoLayout'));

  document.body.classList.remove(`${nameToRemove}-body`);
  document.body.parentNode.classList.remove(`${nameToRemove}-html`);
  document.body.classList.add(`${nameToAdd}-body`);
  document.body.parentNode.classList.add(`${nameToAdd}-html`);
}

router.beforeResolve(async (to, from, next) => {
  await store.dispatch(
    'initState',
    get(to, 'meta.initStore', undefined),
  );
  store.dispatch('setPageError', null);

  document.querySelector('#preloader').style.display = 'none';

  const { primaryOnboardingStep } = store.state.User;
  if (store.state.User.isAuthorised && to.name !== 'Login' && to.name !== 'Logout') {
    const primaryOnboardingRoute = find(routes, { meta: { primaryOnboardingStep } });
    if (primaryOnboardingRoute && primaryOnboardingRoute.name !== to.name) {
      return next({ name: primaryOnboardingRoute.name });
    }
  }

  if (
    (to.name === 'Index' && store.state.User.isAuthorised)
    || (get(to, 'meta.primaryOnboardingStep') && primaryOnboardingStep === 'finished')
  ) {
    const userPermissions = store.getters['User/userPermissions'];
    return redirectOnboardedUser(next, userPermissions);
  }

  if (to.matched.some(record => record.meta.isAuthRequired)) {
    if (!store.state.User.isAuthorised) {
      return next({
        path: '/',
        query: { redirect: to.fullPath },
      });
    }

    const permission = get(to.meta, 'permission', false);
    if (permission) {
      const { role } = store.state.User;
      if (!premissions[role][permission]) {
        resources.notifications.showErrorMessage('You don\'t have permission to access this page');
      }
    }
  }

  const matched = router.getMatchedComponents(to);
  const prevMatched = router.getMatchedComponents(from);

  // мы заботимся только об отсутствующих ранее компонентах,
  // поэтому мы сравниваем два списка, пока не найдём отличия
  let diffed = false;
  // eslint-disable-next-line
  const activated = matched.filter((c, i) => diffed || (diffed = (prevMatched[i] !== c)));

  if (!activated.length) {
    return next();
  }

  Promise.all(activated.map((c) => {
    if (c.asyncData) {
      store.dispatch('setIsLoading', true);
      return c.asyncData({
        store, route: to, resources, registerStoreModule,
      });
    }
    return undefined;
  })).then(() => {
    store.dispatch('setIsLoading', false);

    next();
  }).catch(next);

  return undefined;
});

router.afterEach((to, from) => {
  updateDocumentClassModificators(to, from);
});

export default router;
