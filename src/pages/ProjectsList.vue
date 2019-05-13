<script>
import { mapState, mapActions } from 'vuex';
import {
  Button,
  UiTable,
  UiTableCell,
  UiTableRow,
  PageHeader,
} from '@protocol-one/ui-kit';
import ProjectListPanelItem from '@/components/ProjectListPanelItem.vue';
import StatusIcon from '@/components/StatusIcon.vue';
import NoResults from '@/components/NoResults.vue';
import ProjectsListStore from '@/store/ProjectsListStore';

export default {
  components: {
    Button,
    ProjectListPanelItem,
    UiTable,
    UiTableCell,
    UiTableRow,
    PageHeader,
    StatusIcon,
    NoResults,
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

    <div class="content-wrapper" v-if="viewType === 'panels'">
      <div class="content-list">
        <ProjectListPanelItem
          v-for="project in projects.items"
          :key="project.id"
          :id="project.id"
          :title="project.name.en"
          :status="project.is_active ? 'complete' : 'initial'"
          @remove="removeProject"
        />
        <ProjectListPanelItem
          v-if="!projects.items.length"
          title="Create your first project now"
          :isNew="true"
        />
      </div>
    </div>

    <template v-if="viewType === 'table'">
      <ui-table>
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
      <NoResults v-if="!projects.length" />
    </template>
    <pre>{{projects.items}}</pre>

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
