<template>
  <Page>
    <span slot="header-title">Projects</span>

    <nuxt-link
      slot="header-right"
      to="/project/add"
    >
      <Button>Create project</Button>
    </nuxt-link>

    <div class="content-wrapper">
      <div v-if="projects.length" class="cont-list">
        <PanelItem
          v-for="project in projects"
          :key="project.id"
          :id="project.id"
          :title="project.name"
          :status="project.is_active ? 'complete' : 'initial'"
        />
      </div>
      <p v-else>Projects list is empty</p>
    </div>
  </Page>
</template>

<script>
import axios from 'axios';
import { Button } from '@protocol-one/ui-kit';
import Page from '@/components/Page.vue';
import PanelItem from '@/components/PanelItem.vue';

export default {
  middleware: 'IsNotAuthenticated',
  components: {
    Page,
    Button,
    PanelItem,
  },
  data() {
    return {
      projects: [],
    };
  },
  mounted() {
    const self = this;

    axios.get(`${process.env.apiServerUrl}/api/v1/s/project`, {
      headers: { Authorization: `Bearer ${this.$store.state.user.accessToken}` },
    }).then((response) => {
      self.projects = response.data;
    }).catch(() => {});
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.content-wrapper {
  padding: 16px 32px;
}
.cont-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  & > * {
    margin-bottom: 30px;
    margin-right: 30px;
  }
}
</style>
