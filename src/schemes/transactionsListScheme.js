import { find, flatten, difference } from 'lodash-es';
import getPageMixin from '@/tools/SearchBuilder/getPageMixin';

const filters = {
  id: {
    defaultValue: '',
  },
  orderID: {
    defaultValue: '',
    apiQueryName: 'order_id',
  },
  account: {
    defaultValue: '',
  },
  project: {
    defaultValue: () => [],
    queryToFilter({ queryValue, dictionaries }) {
      return queryValue.split(',').map((id) => {
        const item = find(dictionaries.projects, { id });
        return {
          id,
          label: item.name.en,
        };
      });
    },
    queryToApiQuery({ queryValue }) {
      return queryValue.split(',');
    },
    filterToQuery({ filterValue }) {
      return filterValue.map(item => item.id).join(',');
    },
    filterToApiQuery({ filterValue }) {
      return filterValue.map(item => item.id);
    },
  },
  status: {
    defaultValue: () => [],
    queryToFilter({ queryValue, dictionaries }) {
      const queryValueArray = queryValue.split(',');
      return dictionaries.statuses.filter((item) => {
        const ids = item.id.split(',');
        const diff = difference(queryValueArray, ids);

        if (diff.length + ids.length === queryValueArray.length) {
          return true;
        }
        return false;
      });
    },
    filterToQuery({ filterValue }) {
      return flatten(filterValue.map(item => item.id.split(','))).join(',');
    },
    filterToApiQuery({ filterValue }) {
      return flatten(filterValue.map(item => item.id.split(',').map(num => Number(num))));
    },
  },
  paymentMethod: {
    defaultValue: () => [],
    queryToFilter({ queryValue, dictionaries }) {
      return queryValue.split(',').map(id => find(dictionaries.paymentMethods, { id }));
    },
    filterToQuery({ filterValue }) {
      return filterValue.map(item => item.id).join(',');
    },
    filterToApiQuery({ filterValue }) {
      return filterValue.map(item => item.id);
    },
    apiQueryName: 'payment_method',
  },
  quickFilter: {
    defaultValue: '',
    apiQueryName: 'quick_filter',
  },
  dateFrom: {
    defaultValue: null,
    apiQueryName: 'project_date_from',
    queryToFilter({ queryValue }) {
      return Number(queryValue);
    },
  },
  dateTo: {
    defaultValue: null,
    apiQueryName: 'project_date_to',
    queryToFilter({ queryValue }) {
      return Number(queryValue);
    },
  },

  sort: {
    defaultValue: '_id',
  },
};
export default {
  filters,
  mixins: [getPageMixin()],
};
