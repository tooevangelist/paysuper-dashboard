import { forEach } from 'lodash-es';
import merchantStatusScheme from '@/schemes/merchantStatusScheme';

function getAgreementApiQuerValue(value) {
  if (value === 'all') {
    return [];
  }
  let statusCode;
  forEach(merchantStatusScheme, (item, key) => {
    if (value === item.value) {
      statusCode = key;
    }
  });
  if (statusCode) {
    return [statusCode];
  }
  return [];
}


const filters = {
  quickFilter: {
    defaultValue: '',
    apiQueryName: 'quick_search',
  },

  status: {
    defaultValue: 'all',
    filterToApiQuery({ filterValue }) {
      return getAgreementApiQuerValue(filterValue);
    },
    queryToApiQuery({ queryValue, defaultValue }) {
      return getAgreementApiQuerValue(queryValue || defaultValue);
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
