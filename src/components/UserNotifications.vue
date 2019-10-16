<script>
import { format, isValid } from 'date-fns';
import { truncate } from 'lodash-es';
import merchantStatusScheme from '@/schemes/merchantStatusScheme';

export default {
  name: 'UserNotifications',
  props: {
    /**
     * @typedef {{
     *    id: number,
     *    image?: string,
     *    sender: string,
     *    text: string,
     *    timestamp: string,
     * }} Notify
     * @type {Notify[]}
     */
    items: {
      default: () => [],
      type: Array,
    },
  },
  data() {
    return {
      notifyOpenedID: null,
    };
  },
  computed: {
    innerItems() {
      return this.notifyOpenedID
        ? this.items.filter(item => item.id === this.notifyOpenedID)
        : this.items;
    },
  },
  methods: {
    formatDate(timestamp) {
      const datetime = new Date(timestamp);
      return isValid(datetime) ? format(datetime, 'dd/MM/yyyy') : '';
    },
    prepareText(item) {
      const textArray = [];
      if (item.statuses) {
        textArray.push(this.getStatusChangeText(item.statuses));
      }
      if (item.message) {
        textArray.push(item.message);
      }
      const text = textArray.join('<br/>');
      return this.notifyOpenedID ? text : truncate(text, { length: 100, separator: /,? +/ });
    },
    getStatusChangeText(statuses) {
      const textFrom = statuses.from
        ? merchantStatusScheme[statuses.from].text : merchantStatusScheme[0].text;
      const textTo = statuses.to
        ? merchantStatusScheme[statuses.to].text : merchantStatusScheme[0].text;
      return `License Agreement status changed from ${textFrom} to ${textTo}`;
    },
  },
};
</script>

<template>
<div class="user-notifications">
  <UiScrollbarBox class="content" ref="scrollbar">
    <div
      v-if="notifyOpenedID"
      class="link _back"
      @click="notifyOpenedID = null"
    >
      <IconParagraphPointer class="back-icon" />
      Back
    </div>

    <div
      v-for="(item, index) in innerItems"
      :key="index"
      class="item"
      :class="{ _clickable: !notifyOpenedID }"
      @click="notifyOpenedID = item.id"
    >
      <span class="icon"></span>
      <div class="main">
        <div class="header">
          <div class="title">
            {{ item.is_system ? 'Pay Super' : 'Administrator' }}
          </div>
          <div class="date">{{ formatDate(item.timestamp) }}</div>
        </div>
        <div class="text">{{ prepareText(item) }}</div>
      </div>
    </div>
  </UiScrollbarBox>
</div>
</template>

<style lang="scss" scoped>
.user-notifications {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 16px;
}
.content {
  max-height: 300px;
  // margin-bottom: 24px;
  margin-right: -16px;
  padding-right: 20px;
}
.item {
  display: flex;

  &._clickable {
    cursor: pointer;

    &:not(:last-child) {
      padding-bottom: 8px;
      margin-bottom: 16px;
      border-bottom: 1px solid #f1f3f4;
    }
  }
}
.icon {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f1f3f4;
  flex-shrink: 0;
  transition: background-color 0.2s ease-out;

  .item._clickable:hover & {
    background-color: rgba(61, 123, 245, 0.08);
  }
}
.main {
  line-height: 20px;
  font-size: 14px;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}
.title {
  font-weight: 500;
  color: #000;
  letter-spacing: 0.1px;
  transition: color 0.2s ease-out;

  .item._clickable:hover & {
    color: #3d7bf5;
  }
}
.date {
  font-size: 12px;
  color: #c6cacc;
  letter-spacing: 0.4px;
}
.text {
  color: #5e6366;
  letter-spacing: 0.25px;
  margin-bottom: 4px;
  transition: color 0.2s ease-out;

  .item._clickable:hover & {
    color: #3d7bf5;
  }
}
.link {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  line-height: 20px;
  color: #3d7bf5;
  letter-spacing: 0.25px;
  margin-bottom: 4px;
  cursor: pointer;

  &._back {
    margin-bottom: 12px;
  }
}
.back-icon {
  transform: rotate(180deg);
  margin-right: 12px;
  height: 14px;
  width: 7px;
}
</style>
