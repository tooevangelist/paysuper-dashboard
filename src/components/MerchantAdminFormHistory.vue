<script>
import { format } from 'date-fns';

export default {
  name: 'MerchantAdminFormHistory',

  props: {
    items: {
      required: true,
      type: Array,
    },
  },

  methods: {
    formatDate(seconds) {
      const datetime = new Date(seconds * 1000);
      return format(datetime, 'DD MMM YYYY');
    },

    getStatus(statuses) {
      if (!statuses || !statuses.to) {
        return 'unknown';
      }

      const map = {
        0: 'draft',
        1: 'agreement-requested',
        2: 'on-review',
        3: 'agreement-signing',
        4: 'agreement-signed',
      };

      return map[statuses.to];
    },

    getStatusText(statuses) {
      const status = this.getStatus(statuses);
      const map = {
        unknown: 'No agreement',
        draft: 'New',
        'agreement-requested': 'Agreement requested',
        'on-review': 'On review',
        'agreement-signing': 'Signing',
        'agreement-signed': 'Signed',
        // rejected: 'Rejected',
        // archieved: 'Archieved',
      };
      return map[status] || 'Unknown';
    },
  },
};
</script>

<template>
<UiPanel>
  <UiHeader level="3" :hasMargin="true">
    Timeline
  </UiHeader>
  <UiText>
    Check the whole merchant onboarding process step by step here. This information is not editable.
  </UiText>

  <table class="table">
    <tr
      class="table-row"
      v-for="item in items"
      :key="item.id"
    >
      <td class="table-cell _date">
        {{formatDate(item.created_at.seconds)}}
      </td>
      <td class="table-cell _content">
        <div class="status" :class="`_${getStatus(item.statuses)}`">
          <IconArchieve
            class="status-icon-archieve"
            v-if="getStatus(item.statuses) === 'archieved'"
          />
          {{getStatusText(item.statuses)}}
        </div>
        <p class="title">
          {{item.title}}
        </p>
        <div class="message" v-if="item.message">
          <div class="message-head">
            <span class="message-avatar">
              <IconUser width="10" height="10" />
            </span>
            System Administrator
          </div>
          <p class="message-text">
            {{item.message}}
          </p>
        </div>
      </td>
    </tr>
  </table>
</UiPanel>
</template>

<style lang="scss" scoped>
.table {
  width: 100%;
  border-collapse: collapse;
}

.table-row {
}

.table-cell {
  font-size: 14px;
  line-height: 20px;
  color: #5e6366;
  padding: 16px 48px 20px 0;
  vertical-align: top;

  & + & {
    border-left: 1px solid #e3e5e6;
    padding-left: 48px;
  }

  .table-row + .table-row & {
    border-top: 1px solid #e3e5e6;
  }

  &._date {
    min-width: 160px;
  }

  &._content {
    width: 90%;
  }
}

.status {
  font-family: Quicksand;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
  margin-bottom: 4px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    left: -14px;
    top: 8px;
  }

  .status-icon-archieve {
    position: absolute;
    left: -18px;
    top: 6px;
  }

  &._unknown {
    color: #919699;

    &::before {
      display: none;
    }
  }
  &._draft {
    &::before {
      background: #3d7bf5;
    }
  }
  &._agreement-requested,
  &._on-review {
    &::before {
      background: #f3aa18;
    }
  }
  &._agreement-signing {
    &::before {
      background: #7e57c2;
    }
  }
  &._agreement-signed {
    &::before {
      background: #2fa84f;
    }
  }
  // &._rejected {
  //   &::before {
  //     background: #ea3d2f;
  //   }
  // }
  // &._archieved {
  //   &::before {
  //   }
  // }
}
.message {
  padding-left: 32px;
  margin-top: 16px;
}

.message-head {
  position: relative;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  color: #000000;
  margin-bottom: 4px;
}

.message-avatar {
  position: absolute;
  left: -32px;
  width: 24px;
  height: 24px;
  background: #f7f9fa;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

.message-text {
}
</style>
