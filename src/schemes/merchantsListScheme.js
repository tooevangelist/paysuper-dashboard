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

  limit: {
    isPassingToQueryDisabled: true,
    defaultValue: 30,
  },

  offset: {
    isPassingToQueryDisabled: true,
    defaultValue: 0,
  },

  dateFrom: {
    defaultValue: null,
    apiQueryName: 'last_payout_date_from',
  },

  dateTo: {
    defaultValue: null,
    apiQueryName: 'last_payout_date_to',
  },
};

export default {
  filters,
};
