<script>
import { mapState, mapActions } from 'vuex';
import {
  UiButton,
  UiPageHeader,
} from '@protocol-one/ui-kit';
import ProductStore from '@/store/ProductStore';
import Notifications from '@/mixins/Notifications';
import ProductForm from '@/components/ProductForm.vue';

export default {
  components: {
    UiButton,
    UiPageHeader,
    ProductForm,
  },
  mixins: [Notifications],

  asyncData({ registerStoreModule, route }) {
    return registerStoreModule(
      'Product',
      ProductStore,
      {
        projectId: route.params.id,
        productId: route.params.productId,
      },
    );
  },

  computed: {
    ...mapState('Project', ['project']),
    ...mapState('Product', ['product']),
    breadcrumbs() {
      const crumbs = [
        {
          label: 'Merchants list',
          url: '/merchants/',
        },
        {
          label: this.project.name,
          url: `/merchants/${this.project.id}`,
        },
      ];
      return crumbs;
    },
  },

  methods: {
    ...mapActions('Product', ['updateProduct']),
    ...mapActions(['setIsLoading']),

    async updateProduct() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.setIsLoading(true);

      try {
        await this.updateProduct();
        this.$_Notifications_showSuccessMessage('Product updated successfully');
      } catch (error) {
        console.warn(error);
        this.$_Notifications_showErrorMessage('Failed to save payment method');
      }
      this.setIsLoading(false);
    },

    handleRequestOpenProduct(data) {
      const product = data ? `${data.region}-${data.index}` : 'new';
      this.$router.push({ query: { product } });
    },

    validateAndSaveProduct() {
      const isProductValid = this.$refs.productForm.chekIfFormValid();

      if (isProductValid) {
        this.updateProduct();
        this.$router.push({ query: { step: 'products' } });
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
      :title="product.name"
    >
      <UiButton
        slot="right"
        text="Save"
        @click="validateAndSaveProduct"
      />
    </UiPageHeader>
    <ProductForm
      ref="productForm"
      :product="product"
    />
  </div>
</template>

<style lang="scss" scoped>
</style>
