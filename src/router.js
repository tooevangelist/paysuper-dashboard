import VueRouter from 'vue-router';
import qs from 'qs';
import store from './store/RootStore';
import resources from './resources';
import routes from './routes';

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

router.beforeEach(
  (to, from, next) => {
    next();
  },
);

router.beforeResolve((to, from, next) => {
  if (to.matched.some(record => record.meta.isAuthRequired)) {
    if (!store.state.User.isAuthorised) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
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

  async function registerStoreModule(moduleName, module, initParams) {
    if (!store.state[moduleName]) {
      store.registerModule(moduleName, module(resources));
    }
    return store.dispatch(`${moduleName}/initState`, initParams);
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

export default router;
