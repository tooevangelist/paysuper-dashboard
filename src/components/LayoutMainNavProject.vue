<script>
import { mapState, mapGetters } from 'vuex';
import { findIndex, includes, get } from 'lodash-es';
import LayoutMainNavInnerBase from '@/components/LayoutMainNavInnerBase.vue';


export default {
  name: 'LayoutMainNavProject',

  components: {
    LayoutMainNavInnerBase,
  },

  computed: {
    ...mapState('Project', ['project', 'projectPublicName']),
    ...mapGetters('User', ['userPermissions']),

    items() {
      const projectId = this.project.id || 'new';
      const baseUrl = `/projects/${projectId}`;
      return [
        {
          title: 'Sales options',
          icon: 'IconMoney',
          url: `${baseUrl}/sales-options/`,
          routeNames: [
            'ProjectSalesOptions', 'ProjectVirtualItems',
            'ProjectVirtualCurrency', 'ProjectKeyProductsList',
          ],
          available: true,
        },
        {
          title: 'Webhooks',
          icon: 'IconLabel',
          url: `${baseUrl}/webhooks/`,
          routeNames: ['ProjectWebhooks'],
          available: true,
        },
        {
          title: 'Payment form',
          icon: 'IconTwoArrowsToInside',
          url: `${baseUrl}/payment-form/`,
          routeNames: ['ProjectPaymentForm'],
          available: true,
        },
        {
          title: 'Settings',
          icon: 'IconSettings',
          url: `${baseUrl}/settings/`,
          routeNames: ['ProjectSettings'],
          available: this.userPermissions.editProjects,
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
      return findIndex(this.items, item => includes(item.routeNames, this.$route.name));
    },

    status() {
      if (this.project.status === 4) {
        return 'inactive';
      }
      return 'new';
    },
  },

  methods: {
    get,
  },
};
</script>

<template>
<LayoutMainNavInnerBase
  :headTitle="projectPublicName"
  :headStatus="status"
  :headImage="get(project, 'cover.images.en', '')"
  :items="items"
  :currentItemIndex="currentItemIndex"
/>
</template>
