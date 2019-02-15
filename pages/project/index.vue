<template>
  <Page>
    <span slot="header-title">Projects</span>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body">
              <div class="col-md-12 text-right action-section">
                <nuxt-link
                  type="button"
                  class="btn btn-outline-success btn-lg"
                  to="/project/add"
                  active-class
                  tag="button"
                >
                  <i class="fa fa-plus"/> Add new project
                </nuxt-link>
              </div>

              <div v-if="projects.length <= 0" class="col-md-12">Projects list is empty</div>

              <div v-if="projects.length > 0" class="row">
                <div
                  v-for="(item, index) in projects"
                  :key="index"
                  class="col-4 ccol-4 field-group mr-1 list"
                >
                  <div class="col-12 text-center item">
                    <strong>Name:</strong>
                    {{ item['name'] }}
                  </div>
                  <div class="col-12 text-center item">
                    <strong>Is active:</strong>
                    {{ item['is_active'] === true ? 'Yes' : 'No' }}
                  </div>
                  <div class="col-12 text-center item button">
                    <nuxt-link
                      :to="'/project/' + item['id']"
                      type="button"
                      class="btn btn-outline-success btn-sm"
                      active-class
                      tag="button"
                    >
                      <i class="fa fa-pencil"/> Edit project
                    </nuxt-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>

<script>
import axios from 'axios';
import Page from '@/components/Page.vue';

export default {
  middleware: 'IsNotAuthenticated',
  components: {
    Page,
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
