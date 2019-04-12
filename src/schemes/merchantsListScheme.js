function getAgreementApiQuerValue(value) {
  if (value === 'signed') {
    return [4];
  }
  if (value === 'not_signed') {
    return [0, 1, 2, 3];
  }
  return [];
}


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

  agreement: {
    defaultValue: '',
    apiQueryName: 'status',
    filterToApiQuery({ filterValue }) {
      return getAgreementApiQuerValue(filterValue);
    },
    queryToApiQuery({ queryValue }) {
      return getAgreementApiQuerValue(queryValue);
    },
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
