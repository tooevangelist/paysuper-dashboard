import getPageMixin from '@/tools/SearchBuilder/getPageMixin';

const filters = {
  quickFilter: {
    defaultValue: '',
    apiQueryName: 'quick_search',
  },

  status: {
    defaultValue: () => [],
    isPassingToQueryDisabled: true,
  },

  sort: {
    defaultValue: () => ['-created_at'],
  },
};

export default {
  filters,
  mixins: [getPageMixin()],
};
