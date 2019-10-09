const filters = {
  quickFilter: {
    defaultValue: '',
    apiQueryName: 'name',
  },

  sort: {
    defaultValue: () => [],
  },

  enabled: {
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
};

export default {
  filters,
};
