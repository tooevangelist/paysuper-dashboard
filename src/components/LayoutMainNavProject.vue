<script>
import { mapState } from 'vuex';
import { findIndex } from 'lodash-es';
import LayoutMainNavInnerBase from '@/components/LayoutMainNavInnerBase.vue';

export default {
  name: 'LayoutMainNavProject',

  components: {
    LayoutMainNavInnerBase,
  },

  computed: {
    ...mapState('Project', ['project', 'projectPublicName']),

    items() {
      return [
        {
          title: 'Settings',
          value: 'settings',
          icon: 'IconSettings',
          url: `/projects/${this.project.id || 'new'}?step=settings`,
        },
        {
          title: 'Simple checkout',
          value: 'simpleCheckout',
          icon: 'IconMoney',
          url: `/projects/${this.project.id || 'new'}?step=simpleCheckout`,
        },
        {
          title: 'Products',
          value: 'products',
          icon: 'IconLabel',
          url: `/projects/${this.project.id || 'new'}?step=products`,
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

    currentItemIndex() {
      return findIndex(this.items, { value: this.$route.query.step || 'settings' });
      // return findIndex(this.items, item => includes(item.routeNames, this.$route.name));
    },

    status() {
      if (this.project.status === 4) {
        return 'inactive';
      }
      return 'new';
    },
  },
};
</script>

<template>
<LayoutMainNavInnerBase
  :headTitle="projectPublicName"
  :headStatus="status"
  :headImage="project.image"
  :items="items"
  :currentItemIndex="currentItemIndex"
/>
</template>
