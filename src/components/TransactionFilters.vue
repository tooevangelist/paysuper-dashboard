<template>
<div class="transaction-filters">
  <form @submit.prevent="submitFilters">

    <div class="filters">
      <div class="filters-column">
        <div class="filters-item">
          <TextField label="Quick search" v-model="filters.quickFilter" />
        </div>
      </div>
      <div class="filters-column">
        <div class="filters-item">
          <div class="filters-unit">
            <DateInput dateLabel="Date from" v-model="filters.dateFrom" />
          </div>
          <div class="filters-unit">
            <DateInput dateLabel="Date to" v-model="filters.dateTo" />
          </div>
        </div>
      </div>
      <div class="filters-column">
        <div class="controls _short" v-if="!isDetailedSearchMode">
          <Button type="submit">Search</Button>
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
          <TagInput
            label="Project"
            indent="shallow"
            :tags="projects"
            v-model="filters.project"
          />
        </div>
        <div class="filters-item">
          <TagInput
            label="Status"
            indent="shallow"
            :tags="statuses"
            v-model="filters.status"
          />
        </div>
      </div>
      <div class="filters-column">
        <div class="filters-item">
          <TextField label="User details" v-model="filters.account" />
        </div>
        <div class="filters-item">

          <TagInput
            label="Payment system"
            indent="shallow"
            :tags="paymentMethods"
            v-model="filters.paymentMethod"
          />
        </div>
      </div>
      <div class="filters-column">
        <div class="filters-item">
          <TextField label="Transaction ID" v-model="filters.id" />
        </div>
        <div class="filters-item">
          <TextField label="External ID" v-model="filters.orderID" />
        </div>
      </div>
    </div>
    <div class="controls" v-if="isDetailedSearchMode">
      <Button type="submit">Search</Button>
      <div class="controls-addition">
        <a href="#" @click.prevent="clearFilters">Clear</a>
        or use
        <a href="#" @click.prevent="toggleSearchMode">Quick search</a>
      </div>
    </div>
  </form>
</div>
</template>

<script>
import { mapState } from 'vuex';
import { merge, isEmpty } from 'lodash-es';
import {
  Button, TagInput, TextField, DateInput,
} from '@protocol-one/ui-kit';

function divideByThousand(value) {
  if (String(value).length === 13) {
    return Number((value / 1000).toFixed());
  }
  return value;
}

export default {
  components: {
    Button,
    TagInput,
    TextField,
    DateInput,
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
  computed: {
    ...mapState('order', ['paymentMethods', 'projects', 'statuses']),
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
