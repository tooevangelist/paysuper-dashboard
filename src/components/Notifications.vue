<template>
<div class="notifications">
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
  >
    <div
      class="icon"
      :style="{
        backgroundColor: item.image ? 'transparent' : '#f1f3f4',
        backgroundImage: item.image,
      }"
    />
    <div class="main">
      <div class="header">
        <div class="title">{{ item.sender }}</div>
        <div class="date">{{ formatDate(item.timestamp) }}</div>
      </div>
      <div class="text">{{ prepareText(item.text) }}</div>
      <div
        v-if="!notifyOpenedID"
        class="link"
        @click="notifyOpenedID = item.id"
      >
        Read
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { format, isValid } from 'date-fns';
import { truncate } from 'lodash-es';

export default {
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
      return isValid(datetime) ? format(datetime, 'DD/MM/YYYY') : '';
    },
    prepareText(text) {
      return this.notifyOpenedID ? text : truncate(text, { length: 100, separator: /,? +/ });
    },
  },
};
</script>

<style lang="scss" scoped>
.notifications {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 16px;
}
.item {
  display: flex;

  &:not(:last-child) {
    padding-bottom: 8px;
    margin-bottom: 16px;
    border-bottom: 1px solid #f1f3f4;
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
  border: 1px solid #f1f3f4;
  flex-shrink: 0;
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
