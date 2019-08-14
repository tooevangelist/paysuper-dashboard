<script>
import { mapState } from 'vuex';
// import { includes, findIndex } from 'lodash-es';

export default {
  name: 'LayoutMainNavProject',

  computed: {
    ...mapState('Project', ['project']),

    items() {
      return [
        {
          icon: 'IconSettings',
          value: 'settings',
          title: 'Settings',
        },
        {
          icon: 'IconMoney',
          value: 'simpleCheckout',
          title: 'Simple checkout',
        },
        {
          icon: 'IconLabel',
          value: 'products',
          title: 'Products',
        },


        // {
        //   icon: 'IconInfo',
        //   link: '',
        //   title: 'About',
        // },
        // {
        //   icon: 'IconSettings',
        //   link: `/projects/${this.project.id}/`,
        //   title: 'Settings',
        //   routeNames: ['ProjectCard'],
        // },
        // {
        //   icon: 'IconLabel',
        //   link: '',
        //   title: 'Webhooks',
        // },
        // {
        //   icon: 'IconMoney',
        //   link: '',
        //   title: 'Sales options',
        // },
        // {
        //   icon: 'IconTwoArrowsToInside',
        //   link: '',
        //   title: 'Testing',
        // },
      ];
    },

    currentItem() {
      return this.$route.query.step || 'settings';
      // return findIndex(this.items, item => includes(item.routeNames, this.$route.name));
    },

    status() {
      if (this.project.status === 4) {
        return 'Inactive';
      }
      return 'Active';
    },
  },
};
</script>

<template>
<div class="layout-main-nav-project">
  <div class="project">
    <span
      class="project-icon"
      :style="{backgroundImage: `url(${project.image})`}"
    >
      <IconNoImage v-if="!project.image" />
    </span>
    <div class="project-texts">
      <UiHeader
        class=""
        level="3"
      >
        <div
          class="project-name"
          :class="{'_no-name': !project.name.en}"
        >
          {{project.name.en || 'No name'}}
        </div>
      </UiHeader>
      <div
        class="project-status"
        :class="`_${status.toLowerCase()}`"
      >
        {{status}}
      </div>
    </div>
  </div>
  <div class="nav">
    <RouterLink
      v-for="(item, index) in items"
      :key="index"
      :class="['item', { '_current': currentItem === item.value }]"
      :to="`/projects/${project.id || 'new'}?step=${item.value}`"
    >
      <div class="icon">
        <component :is="item.icon" />
      </div>
      <div class="text">
        <div class="title">{{ item.title }}</div>
      </div>
    </RouterLink>
  </div>
</div>
</template>

<style lang="scss" scoped>
.layout-main-nav-project {
  display: flex;
  flex-direction: column;
}

.project {
  flex-grow: 0;
  display: flex;
  align-content: center;
  align-items: center;
  padding: 8px 12px;
  background-color: #f7f9fa;
}

.project-icon {
  display: flex;
  flex-shrink: 0;
  align-content: center;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 12px;
  border-radius: 50%;
  background-size: cover;
}

.project-texts {
  max-width: calc(100% - 44px);
}

.project-name {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  &._no-name {
    color: #919699;
  }
}

.project-status {
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.4px;

  &._active {
    color: #069697;
  }

  &._inactive {
    color: #ea3d2f;
  }
}

.nav {
  padding-top: 10px;
}

.item {
  display: flex;
  align-content: center;
  align-items: center;
  padding: 0 12px 0 32px;
  height: 40px;
  transition: background-color 0.2s ease-out;

  &:hover:not(._current) {
    background-color: #e6efff;
  }

  &._current {
    cursor: default;
  }
}
.icon {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  margin-right: 9px;

  & > svg {
    fill: #000;
    transition: fill 0.2s ease-out;
  }

  .item:hover & > svg {
    fill: #3d7bf5;
  }

  .item._current & > svg {
    fill: #c6cacc;
  }
}
.title {
  color: #000;
  font-size: 14px;
  line-height: 20px;
  transition: color 0.2s ease-out;
  margin-top: 2px;

  .item:hover & {
    color: #3d7bf5;
  }

  .item._current & {
    color: #c6cacc;
  }
}
</style>
