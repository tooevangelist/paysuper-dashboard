<script>
import { mapState, mapActions } from 'vuex';
import {
  Button,
  UiTable,
  UiTableCell,
  UiTableRow,
  PageHeader,
} from '@protocol-one/ui-kit';
import PanelItem from '@/components/PanelItem.vue';
import StatusIcon from '@/components/StatusIcon.vue';
import ProjectsListStore from '@/store/ProjectsListStore';

export default {
  components: {
    Button,
    PanelItem,
    UiTable,
    UiTableCell,
    UiTableRow,
    PageHeader,
    StatusIcon,
  },
  asyncData({ registerStoreModule }) {
    return registerStoreModule('ProjectsListing', ProjectsListStore);
  },
  data() {
    return {
      viewType: 'panels',
    };
  },
  computed: {
    ...mapState('ProjectsListing', ['projects']),
  },

  methods: {
    ...mapActions('ProjectsListing', ['removeProject']),
  },
};
</script>

<template>
  <div>
    <PageHeader title="Projects">
      <template slot="right">
        <div>
          <a href="#" @click="viewType = 'panels'">panels</a>
          /
          <a href="#" @click="viewType = 'table'">table</a>
          &nbsp;
        </div>
        <router-link
          to="/projects/new"
        >
          <Button>Create project</Button>
        </router-link>
      </template>
    </PageHeader>

    <div class="content-wrapper" v-if="viewType === 'panels' || !projects.length">
      <div class="content-list">
        <PanelItem
          v-for="project in projects"
          :key="project.id"
          :id="project.id"
          :title="project.name"
          :status="project.is_active ? 'complete' : 'initial'"
          @remove="removeProject"
        />
        <PanelItem
          v-if="!projects.length"
          title="Create your first project now"
          :isNew="true"
        />
      </div>
    </div>

    <ui-table v-if="viewType === 'table'">
      <ui-table-row :isHead="true">
        <ui-table-cell>Name</ui-table-cell>
        <ui-table-cell>Product ID</ui-table-cell>
        <ui-table-cell>Status</ui-table-cell>
        <ui-table-cell>Creation date</ui-table-cell>
      </ui-table-row>
      <ui-table-row
        v-for="project in projects"
        :key="project.id"
        :link="{
          url: `/projects/${project.id}`,
          router: true
        }"
      >
        <ui-table-cell>{{project.name}}</ui-table-cell>
        <ui-table-cell>{{project.id}}</ui-table-cell>
        <ui-table-cell>
          <StatusIcon :status="project.is_active ? 'complete' : 'initial'" />
        </ui-table-cell>
        <ui-table-cell>{{project.created_at}}</ui-table-cell>
      </ui-table-row>
    </ui-table>
  </div>
</template>

<style lang="scss" scoped>
.content-wrapper {
  padding: 16px 32px;
}
.content-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  & > * {
    margin-bottom: 30px;
    margin-right: 30px;
  }
}
</style>
