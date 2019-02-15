<template>
  <Page>
    <span slot="header-title">Add project</span>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <project :project="{}"/>
        </div>
      </div>
    </div>
  </Page>
</template>

<script>
import Page from '@/components/Page.vue';
import Project from '../../components/Project.vue';

export default {
  middleware: 'IsNotAuthenticated',
  components: { Project, Page },
  data() {
    return {};
  },
};
</script>
