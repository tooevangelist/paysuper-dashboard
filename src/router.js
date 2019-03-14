import VueRouter from 'vue-router';
import qs from 'qs';
import store from './store/RootStore';
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

  // здесь мы должны вызвать индикатор загрузки, если используем его
  Promise.all(activated.map((c) => {
    if (c.asyncData) {
      return c.asyncData({ store, route: to });
    }
    return undefined;
  })).then(() => {
    // останавливаем индикатор загрузки

    next();
  }).catch(next);


  return undefined;
});

export default router;
