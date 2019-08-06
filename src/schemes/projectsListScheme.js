function getStatusApiQueryValue(value) {
  if (value === 'inactive') {
    return [4];
  }
  if (value === 'active') {
    return [0, 1, 2, 3];
  }
  return [];
}


const filters = {
  quickFilter: {
    defaultValue: '',
    apiQueryName: 'quick_search',
  },

  status: {
    defaultValue: '',
    filterToApiQuery({ filterValue }) {
      return getStatusApiQueryValue(filterValue);
    },
    queryToApiQuery({ queryValue }) {
      return getStatusApiQueryValue(queryValue);
    },
  },
};

export default {
  filters,
};
