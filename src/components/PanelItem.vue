<template>
<div class="panel-item">
  <div class="header-block">
    <router-link
      class="header-link"
      :to="isNew ? '/projects/new' : `/projects/${id}`"
    >
      <div class="hover-layer" v-if="!isNew">
        <button
          class="control-button"
          type="button"
          title="Edit"
        >
          <IconPencil />
        </button>
        <button
          class="control-button"
          type="button"
          title="Remove"
          @click.prevent="$emit('remove', id)"
        >
          <svg viewBox="0 0 16 16" width="16" height="16" stroke="#333333" stroke-width="1">
            <path d="M0,0 L16,16" />
            <path d="M16,0 L0,16" />
          </svg>
        </button>
      </div>
      <span class="id" v-if="id">{{id}}</span>
      <StatusIcon v-if="!isNew" class="status-icon" :status="status" />
      <div class="picture">
        <svg
          v-if="isNew"
          width="36" height="38" viewBox="0 0 36 38" fill="none" xmlns="http://www.w3.org/2000/svg"
        >
        <!-- eslint-disable-next-line -->
        <path d="M21.6289 15.543H35.9023V21.6953H21.6289V37.8672H15.0898V21.6953H0.816406V15.543H15.0898V0.601562H21.6289V15.543Z" fill="white"/>
        </svg>

      </div>
      <div class="title">
        <Header class="title-text" level="2">{{title}}</Header>
      </div>
    </router-link>
  </div>
  <div class="footer" v-if="isNew">
    It’s easy like 1-2-3
  </div>
  <div class="footer" v-if="false">
    <div class="footer-item">
      <a href="#">simple checkout</a>
    </div>
    <div class="footer-item">
      <a href="#">3 products</a>
    </div>
    <div class="footer-item">
      <a href="#">2 subscriptions</a>
    </div>
  </div>
</div>
</template>

<script>
import { includes } from 'lodash-es';
import { Header } from '@protocol-one/ui-kit';
import IconPencil from './IconPencil.vue';
import StatusIcon from './StatusIcon.vue';

export default {
  name: 'PanelItem',

  components: {
    IconPencil,
    StatusIcon,
    Header,
  },

  props: {
    id: {
      type: [String, Number],
    },

    title: {
      type: String,
    },

    status: {
      type: String,
      default: 'initial',
      validator(value) {
        return includes(['initial', 'incomplete', 'complete'], value);
      },
    },

    isNew: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-item {
  width: 30%;
  max-width: 350px;
  min-width: 200px;
  flex-shrink: 0;
  background: #ffffff;
  border: 1px solid rgba(177, 177, 177, 0.25);
  box-sizing: border-box;
  border-radius: 4px;
}

.header-block {
  height: 226px;
  position: relative;
  cursor: pointer;
}

.header-link {
  text-decoration: none;
}

.picture {
  position: absolute;
  top: 48px;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  background: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  padding: 0 10px;
}

.title-text {
  /deep/ h2 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    justify-content: center;
  }
}

.id {
  position: absolute;
  font-size: 13px;
  line-height: 18px;
  color: #333333;
  top: 20px;
  left: 18px;

  &::before {
    content: "id";
    font-size: 9px;
    color: #b1b1b1;
    margin-right: 2px;
  }
}

.status-icon {
  position: absolute;
  top: 15px;
  right: 16px;
}

.hover-layer {
  display: none;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: rgba(32, 61, 95, 0.45);
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 10;

  .header-block:hover & {
    display: flex;
  }
}

.control-button {
  width: 32px;
  height: 32px;
  background: #fff;
  border-radius: 50%;
  border: 0;
  margin: 0 4px;
  padding: 0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: #f2f2f2;
  }
}

.footer {
  height: 78px;
  background: linear-gradient(180deg, #f3f3f3 0%, rgba(255, 255, 255, 0) 100%),
    #f6f6f6;
  border-top: 1px solid #ebebeb;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.footer-item {
  a {
    color: #2275d7;
  }
}
</style>
