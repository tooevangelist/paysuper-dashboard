<script>
import { merge, isEmpty } from 'lodash-es';
import {
  UiButton, UiTagInput, UiTextField, UiDateInput,
} from '@protocol-one/ui-kit';

function divideByThousand(value) {
  if (String(value).length === 13) {
    return Number((value / 1000).toFixed());
  }
  return value;
}

export default {
  components: {
    UiButton,
    UiTagInput,
    UiTextField,
    UiDateInput,
  },
  props: {
    getFilterValues: {
      type: Function,
      required: true,
    },
    getEmptyFilterValues: {
      type: Function,
      required: true,
    },
    paymentMethods: {
      type: Array,
      required: true,
    },
    projects: {
      type: Array,
      required: true,
    },
    statuses: {
      type: Array,
      required: true,
    },
  },
  data() {
    const filterNames = [
      'id',
      'orderID',
      'account',
      'project',
      'status',
      'paymentMethod',
      'quickFilter',
      'dateFrom',
      'dateTo',
    ];
    return {
      isDetailedSearchMode: false,
      filterNames,
      filters: this.getFilterValues(filterNames),
    };
  },

  created() {
    if (
      this.filters.orderID
      || this.filters.account
      || !isEmpty(this.filters.project)
      || !isEmpty(this.filters.status)
      || !isEmpty(this.filters.paymentMethod)
    ) {
      this.isDetailedSearchMode = true;
    }
  },

  methods: {
    submitFilters() {
      const filtersMapping = {};
      if (this.filters.dateFrom) {
        filtersMapping.dateFrom = divideByThousand(this.filters.dateFrom);
      }
      if (this.filters.dateTo) {
        filtersMapping.dateTo = divideByThousand(this.filters.dateTo);
      }
      const result = merge(
        {},
        this.filters,
        filtersMapping,
      );
      this.$emit('searchRequested', result);
    },

    clearFilters() {
      this.filters = this.getEmptyFilterValues(this.filterNames);
      this.submitFilters();
    },

    updateFiltersFromQuery() {
      this.filters = this.getFilterValues(this.filterNames);
    },

    toggleSearchMode() {
      this.isDetailedSearchMode = !this.isDetailedSearchMode;
      this.filters = {
        ...this.filters,
        ...this.getEmptyFilterValues(['quickFilter']),
      };
      this.submitFilters();
    },
  },
};
</script>

<template>
<div class="transaction-filters">
  <form @submit.prevent="submitFilters">

    <div class="filters">
      <div class="filters-column">
        <div class="filters-item">
          <UiTextField label="Quick search" v-model="filters.quickFilter" />
        </div>
      </div>
      <div class="filters-column">
        <div class="filters-item">
          <div class="filters-unit">
            <UiDateInput dateLabel="Date from" v-model="filters.dateFrom" />
          </div>
          <div class="filters-unit">
            <UiDateInput dateLabel="Date to" v-model="filters.dateTo" />
          </div>
        </div>
      </div>
      <div class="filters-column">
        <div class="controls _short" v-if="!isDetailedSearchMode">
          <UiButton type="submit">Search</UiButton>
          <div class="controls-addition">
            or use
            <a href="#" @click.prevent="toggleSearchMode">Advanced search</a>
          </div>
        </div>
      </div>
    </div>
    <div class="filters" v-if="isDetailedSearchMode">
      <div class="filters-column">
        <div class="filters-item">
          <UiTagInput
            label="Project"
            indent="shallow"
            :tags="projects"
            v-model="filters.project"
          />
        </div>
        <div class="filters-item">
          <UiTagInput
            label="Status"
            indent="shallow"
            :tags="statuses"
            v-model="filters.status"
          />
        </div>
      </div>
      <div class="filters-column">
        <div class="filters-item">
          <UiTextField label="User details" v-model="filters.account" />
        </div>
        <div class="filters-item">

          <UiTagInput
            label="Payment system"
            indent="shallow"
            :tags="paymentMethods"
            v-model="filters.paymentMethod"
          />
        </div>
      </div>
      <div class="filters-column">
        <div class="filters-item">
          <UiTextField label="Transaction ID" v-model="filters.id" />
        </div>
        <div class="filters-item">
          <UiTextField label="External ID" v-model="filters.orderID" />
        </div>
      </div>
    </div>
    <div class="controls" v-if="isDetailedSearchMode">
      <UiButton type="submit">Search</UiButton>
      <div class="controls-addition">
        <a href="#" @click.prevent="clearFilters">Clear</a>
        or use
        <a href="#" @click.prevent="toggleSearchMode">Quick search</a>
      </div>
    </div>
  </form>
</div>
</template>

<style lang="scss">
.transaction-filters {
  padding: 12px 30px 20px;
}

.short {
  display: flex;
  align-items: center;
}

.short-filters {
  display: flex;
}

.short-filters-item {
  width: 200px;
  margin-right: 40px;
}

.filters {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  max-width: 1100px;
}

.filters-column {
  width: 30%;
}

.filters-item {
  display: flex;
  justify-content: space-between;
}

.filters-unit {
  width: 46%;
}

.controls {
  display: flex;
  align-items: center;

  &._short {
    padding-top: 15px;
  }

  a {
    color: #2275d7;
  }
}
.controls-addition {
  margin-left: 22px;
}
</style>
