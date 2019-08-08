function getPageQuery({ queryValue, groupFilterValues: { limit } }) {
  return {
    limit,
    offset: (queryValue - 1) * limit,
  };
}

export default function getPageMixin({ defaultLimit = 10 } = {}) {
  return {
    filters: {
      limit: {
        defaultValue: defaultLimit,
        group: 'page',
      },

      offset: {
        defaultValue: 0,
        group: 'page',
      },
    },
    groupHandlers: {
      page: {
        filterToQuery({ groupFilterValues: { offset, limit } }) {
          return {
            page: (offset / limit) + 1,
          };
        },
        queryToFilter: getPageQuery,
        queryToApiQuery: getPageQuery,
      },
    },
  };
}
