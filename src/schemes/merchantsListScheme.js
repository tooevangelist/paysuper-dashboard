const filters = {
  quickFilter: {
    defaultValue: '',
    apiQueryName: 'quick_search',
  },

  limit: {
    defaultValue: 10,
    group: 'page',
  },

  offset: {
    defaultValue: 0,
    group: 'page',
  },

  status: {
    defaultValue: () => [],
    isQueryDisabled: true,
  },

  sort: {
    defaultValue: () => [],
  },
};

function getPageQuery({ queryValue, groupFilterValues: { limit } }) {
  return {
    limit,
    offset: (queryValue - 1) * limit,
  };
}

const groupHandlers = {
  page: {
    filterToQuery({ groupFilterValues: { offset, limit } }) {
      return {
        page: (offset / limit) + 1,
      };
    },
    queryToFilter: getPageQuery,
    queryToApiQuery: getPageQuery,
  },
};


export default {
  filters,
  groupHandlers,
};
