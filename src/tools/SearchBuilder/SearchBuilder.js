import {
  merge, includes, omitBy, isEmpty, mapValues, forEach,
} from 'lodash-es';

function getCleanQuery(query) {
  return omitBy(query, (value) => {
    if (value === 0 || value === undefined || value === null || value === '') {
      return true;
    }
    if (typeof value === 'object' && isEmpty(value)) {
      return true;
    }

    return false;
  });
}

export default class SearchBulder {
  constructor(scheme) {
    const { mixins, ...restOfScheme } = scheme;
    this.scheme = { groupHandlers: {} };

    if (mixins) {
      mixins.forEach((item) => {
        merge(this.scheme, item);
      });
    }

    merge(this.scheme, restOfScheme);
  }

  getFilterValues({ filterNames = null, query = {}, dictionaries = {} } = {}) {
    const emptyFilterValues = this.getEmptyFilterValues();
    const groups = {};
    let schemeFilters = this.scheme.filters;
    if (filterNames) {
      schemeFilters = omitBy(this.scheme.filters, (value, name) => !includes(filterNames, name));
    }
    const filters = mapValues(schemeFilters, (schemeItem, filterName) => {
      const queryName = schemeItem.queryName || filterName;

      if (query[queryName]) {
        if (schemeItem.queryToFilter) {
          return schemeItem.queryToFilter({
            query,
            dictionaries,
            queryValue: query[queryName],
            defaultValue: schemeItem.defaultValue,
            emptyFilterValues,
          });
        }
        return query[queryName];
      }

      if (typeof schemeItem.defaultValue === 'function') {
        return schemeItem.defaultValue();
      }
      return schemeItem.defaultValue;
    });

    let result = {};
    forEach(filters, (filterValue, filterName) => {
      const schemeItem = this.scheme.filters[filterName];

      if (
        schemeItem.group
        && this.scheme.groupHandlers[schemeItem.group]
        && this.scheme.groupHandlers[schemeItem.group].queryToFilter
      ) {
        groups[schemeItem.group] = groups[schemeItem.group] || {};
        groups[schemeItem.group][filterName] = filterValue;
      } else {
        result[filterName] = filterValue;
      }
    });

    forEach(groups, (groupFilterValues, name) => {
      const handler = this.scheme.groupHandlers[name].queryToFilter;
      const queryValue = query[name];
      if (queryValue) {
        result = {
          ...result,
          ...handler({ query, queryValue, groupFilterValues }),
        };
      } else {
        result = {
          ...result,
          ...groupFilterValues,
        };
      }
    });

    return result;
  }

  getEmptyFilterValues({ filterNames = null } = {}) {
    let schemeFilters = this.scheme.filters;
    if (filterNames) {
      schemeFilters = omitBy(this.scheme.filters, (value, name) => !includes(filterNames, name));
    }
    return mapValues(schemeFilters, (filter) => {
      if (typeof filter.defaultValue === 'function') {
        return filter.defaultValue();
      }
      return filter.defaultValue;
    });
  }

  getQueryFromFilterValues(filters) {
    let query = {};
    const groups = {};
    forEach(filters, (filterValue, filterName) => {
      const schemeItem = this.scheme.filters[filterName];

      if (schemeItem.isPassingToQueryDisabled) {
        return;
      }

      if (
        schemeItem.group
        && this.scheme.groupHandlers[schemeItem.group]
        && this.scheme.groupHandlers[schemeItem.group].filterToQuery
      ) {
        groups[schemeItem.group] = groups[schemeItem.group] || {};
        groups[schemeItem.group][filterName] = filterValue;
      } else {
        query[schemeItem.queryName || filterName] = schemeItem.filterToQuery
          ? schemeItem.filterToQuery({ filterValue })
          : filterValue;
      }
    });

    forEach(groups, (groupFilterValues, name) => {
      const handler = this.scheme.groupHandlers[name].filterToQuery;
      query = {
        ...query,
        ...handler({ groupFilterValues }),
      };
    });

    return getCleanQuery(query);
  }

  getApiQueryFromFilterValues(filters) {
    let apiQuery = {};
    const groups = {};
    forEach(filters, (filterValue, filterName) => {
      const schemeItem = this.scheme.filters[filterName];

      if (schemeItem.isPassingToApiQueryDisabled) {
        return;
      }

      if (
        schemeItem.group
        && this.scheme.groupHandlers[schemeItem.group]
        && this.scheme.groupHandlers[schemeItem.group].filterToApiQuery
      ) {
        groups[schemeItem.group] = groups[schemeItem.group] || {};
        groups[schemeItem.group][filterName] = filterValue;
      } else {
        apiQuery[schemeItem.apiQueryName || filterName] = schemeItem.filterToApiQuery
          ? schemeItem.filterToApiQuery({ filterValue })
          : filterValue;
      }
    });

    forEach(groups, (filterValues, name) => {
      const handler = this.scheme.groupHandlers[name].filterToApiQuery;
      apiQuery = {
        ...apiQuery,
        ...handler({ filterValues }),
      };
    });

    return getCleanQuery(apiQuery);
  }

  getApiQueryFromQuery(query) {
    const emptyFilterValues = this.getEmptyFilterValues();

    const groups = {};
    const filters = mapValues(this.scheme.filters, (schemeItem, filterName) => {
      const queryName = schemeItem.queryName || filterName;

      if (query[queryName]) {
        if (schemeItem.queryToApiQuery) {
          return schemeItem.queryToApiQuery({
            query,
            queryValue: query[queryName],
            defaultValue: schemeItem.defaultValue,
            emptyFilterValues,
          });
        }
        return query[queryName];
      }

      if (typeof schemeItem.defaultValue === 'function') {
        return schemeItem.defaultValue();
      }

      return schemeItem.defaultValue;
    });

    let apiQuery = {};
    forEach(filters, (filterValue, filterName) => {
      const schemeItem = this.scheme.filters[filterName];

      if (schemeItem.isPassingToApiQueryDisabled) {
        return;
      }

      if (
        schemeItem.group
        && this.scheme.groupHandlers[schemeItem.group]
        && this.scheme.groupHandlers[schemeItem.group].queryToApiQuery
      ) {
        groups[schemeItem.group] = groups[schemeItem.group] || {};
        groups[schemeItem.group][filterName] = filterValue;
      } else {
        apiQuery[schemeItem.apiQueryName || filterName] = filterValue;
      }
    });

    forEach(groups, (groupFilterValues, name) => {
      const handler = this.scheme.groupHandlers[name].queryToApiQuery;
      const queryValue = query[name];
      if (queryValue) {
        apiQuery = {
          ...apiQuery,
          ...handler({ query, queryValue, groupFilterValues }),
        };
      } else {
        apiQuery = {
          ...apiQuery,
          ...groupFilterValues,
        };
      }
    });

    return getCleanQuery(apiQuery);
  }
}
