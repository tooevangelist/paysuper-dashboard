<script>
import { mapState, mapActions } from 'vuex';
import { UiButton, UiPageHeader } from '@protocol-one/ui-kit';
import Notifications from '@/mixins/Notifications';
import ProjectForm from '@/components/ProjectForm.vue';
import ProductForm from '@/components/ProductForm.vue';
import ProjectStore from '@/store/ProjectStore';

export default {
  components: {
    UiButton, UiPageHeader, ProjectForm, ProductForm,
  },
  mixins: [Notifications],

  asyncData({ registerStoreModule, route }) {
    return registerStoreModule('Project', ProjectStore, route.params.id);
  },

  data() {
    return {
      defaultStep: 'settings',
      currentStep: '',
    };
  },

  computed: {
    ...mapState('Project', ['project', 'product']),
    breadcrumbs() {
      const crumbs = [
        {
          label: 'Projects list',
          url: '/projects/',
        },
      ];

      if (this.product) {
        if (this.project.id) {
          crumbs.push({
            label: this.project.name,
            url: `/projects/${this.project.id}`,
          });
        } else {
          crumbs.push({
            label: 'New project',
            url: '/projects/new',
          });
        }
      }
      return crumbs;
    },
  },

  beforeRouteUpdate(to, from, next) {
    this.applyQueryParams(to);
    next();
  },

  created() {
    this.applyQueryParams(this.$route);
  },

  methods: {
    ...mapActions('Project', [
      'createProject',
      'saveProject',
      'openProduct',
      'createProduct',
      'closeProduct',
      'saveProduct',
    ]),

    applyQueryParams(route) {
      this.currentStep = route.query.step || this.defaultStep;
      if (route.query.product) {
        if (route.query.product === 'new') {
          this.createProduct();
        } else {
          const [region, index] = route.query.product.split('-');
          this.openProduct({
            region,
            index,
          });
        }
      } else {
        this.closeProduct();
      }
    },

    handleSectionChange(step) {
      this.$router.push({ query: { step } });
    },

    handleRequestOpenProduct(data) {
      const product = data ? `${data.region}-${data.index}` : 'new';
      this.$router.push({ query: { product } });
    },

    handleSaveButtonClick() {
      if (this.product) {
        this.validateAndSaveProduct();
      } else {
        this.validateAndSaveProject();
      }
    },

    validateAndSaveProduct() {
      const isProductValid = this.$refs.productForm.chekIfFormValid();

      if (isProductValid) {
        this.saveProduct();
        this.$router.push({ query: { step: 'products' } });
      } else {
        this.$_Notifications_showErrorMessage('The form is not filled right');
      }
    },

    async validateAndSaveProject() {
      const isProjectValid = this.$refs.projectForm.chekIfFormValid();

      if (isProjectValid) {
        if (this.project.id) {
          this.saveProject();
        } else {
          this.createProject();
        }
      } else {
        this.$_Notifications_showErrorMessage('The form is not filled right');
      }
    },
  },
};
</script>

<template>
  <div>
    <UiPageHeader
      :breadcrumbs="breadcrumbs"
      :title="product ? `Product ${product.data.name}` : project.name || 'New project'"
    >
      <UiButton
        slot="right"
        @click="handleSaveButtonClick"
        :text="project.id ? 'Save' : 'Create project'"
      />
    </UiPageHeader>
    <ProductForm
      v-if="product"
      ref="productForm"
      :product="product.data"
    />
    <ProjectForm
      v-else
      ref="projectForm"
      :project="project"
      :currentStep="currentStep"
      @requestOpenProduct="handleRequestOpenProduct"
      @stepChanged="handleSectionChange"
    />
  </div>
</template>
