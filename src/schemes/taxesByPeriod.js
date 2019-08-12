import getPageMixin from '@/tools/SearchBuilder/getPageMixin';

const filters = {
  quickFilter: {
    defaultValue: '',
    apiQueryName: 'quick_search',
  },
};

export default {
  filters,
  mixins: [getPageMixin()],
};
