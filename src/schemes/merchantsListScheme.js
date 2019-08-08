import getPageMixin from '@/tools/SearchBuilder/getPageMixin';

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
};

export default {
  filters,
  mixins: [getPageMixin()],
};
