<script>
import { find } from 'lodash-es';
import { mapState, mapActions } from 'vuex';
import { maxLength, required } from 'vuelidate/lib/validators';
import PaymentLinkCardStore from '@/store/PaymentLinkCardStore';
import SelectProductsModal from '@/components/SelectProductsModal.vue';

export default {
  name: 'PaymentLinksCreate',
  validations: {
    createLink: {
      name: { maxLength: maxLength(256), required },
      dateInput: { maxLength: maxLength(60), required },
    },
  },
  components: {
    SelectProductsModal,
  },
  data() {
    return {
      createLink: {
        name: '',
        dateInput: '',
        projectId: null,
        productsType: null,
      },
      noExpirationDate: false,
      isSelectProductsModalOpened: false,
      isDeleteModalOpened: false,
      productsItems: [],
      productsItemsSelected: [],
      selectProducts: [],
      productsToDelete: '',
      defaultProduct: '',
    };
  },

  async asyncData({ store, registerStoreModule }) {
    try {
      await registerStoreModule('PaymentLink', PaymentLinkCardStore, {});
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },

  computed: {
    ...mapState('PaymentLink', [
      'productsList',
      'projectsList',
    ]),

    productsItemsOptions() {
      return this.productsList.items.map(item => ({ label: item.name.en, value: item.id }));
    },

    projectsOptions() {
      return this.projectsList.items.map(item => ({ label: item.name.en, value: item.id }));
    },

    productsListModal() {
      return this.productsList.items.slice();
    },

    isCreate() {
      let date = false;

      if (!this.noExpirationDate) {
        date = this.createLink.dateInput !== '';
      } else {
        date = true;
      }

      return this.createLink.name !== ''
          && date
          && this.productsItems.length > 0;
    },
  },

  methods: {
    ...mapActions('PaymentLink', ['fetchProducts', 'createItem']),
    ...mapActions(['setIsLoading']),

    updateField() {
      console.log('update');
    },

    handleSetDate(value) {
      this.createLink.dateInput = value;
    },

    requestDeleteProductModal() {
      this.isSelectProductsModalOpened = false;
      this.isDeleteModalOpened = true;
    },

    handleModalSave() {
      this.productsItems = this.productsItemsSelected;
      this.isSelectProductsModalOpened = false;
    },

    updateSelectProducts(value) {
      console.log(value);
      this.productsItemsSelected = value;
    },

    async openSelectProductsModal() {
      await this.fetchProducts(this.createLink.projectId);
      this.isSelectProductsModalOpened = true;
    },

    deleteProductInList(index) {
      this.productsItems.splice(index, 1);
    },

    getItemPrice(item) {
      if (item.billing_type === 'virtual') {
        const price = find(item.prices, { is_virtual_currency: true });
        if (!price) {
          return '';
        }
        return `VC ${price.amount}`;
      }

      const price = find(item.prices, this.defaultCurrency);
      if (!price) {
        return '';
      }
      return this.$formatPrice(price.amount, price.currency);
    },

    async create() {
      // this.$navigate(`/projects/${this.project.id}/virtual-items/`);
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$showErrorMessage('The form is not filled right');
        return;
      }
      const products = this.productsItems.map(item => (item.id));
      this.setIsLoading(true);
      const data = {
        products,
        expires_at: this.createLink.dateInput,
        project_id: this.createLink.projectId,
        name: this.createLink.name,
        no_expiry_date: this.noExpirationDate,
        products_type: 'product',
      };
      try {
        await this.createItem(data);
        this.$showSuccessMessage('Saved successfully');
        this.$navigate('/payment-links/');
      } catch (e) {
        this.$showErrorMessage(e);
      }
      this.setIsLoading(false);
    },
  },

  mounted() {
    console.log(this.productsList);
  },
};
</script>

<template>
  <div>
    <UiPageHeaderFrame>
      <template slot="title">
        Link creating
      </template>
    </UiPageHeaderFrame>
    <UiPanel>
      <section class="section">
        <UiHeader level="3" :hasMargin="true">
          Initial details
        </UiHeader>
        <UiTextField
          v-bind="$getValidatedFieldProps('createLink.name')"
          label="Name"
          v-model="createLink.name"
          @input="updateField('name', $event)"
          @blur="$v.createLink.name.$touch()"
        />
        <UiDate
          v-bind="$getValidatedFieldProps('createLink.dateInput')"
          class="expiration-date"
          :value="createLink.dateInput"
          label="Expiration date"
          :required="true"
          v-model="createLink.dateInput"
          @input="handleSetDate"
          :disabled="noExpirationDate"
        />
        <UiSwitchBox v-model="noExpirationDate">
          No expiration date
        </UiSwitchBox>
        <UiSelect
          v-bind="$getValidatedFieldProps('createLink.project_id')"
          label="Project"
          class="select-project"
          :options="projectsOptions"
          :value="createLink.projectId"
          v-model="createLink.projectId"
        />
      </section>
      <section class="section" v-if="createLink.projectId !== null">
        <UiHeader class="section__header" level="3" :hasMargin="true">
          Products
        </UiHeader>
        <div class="section__info">
          Do aliquip labore dolor irure cillum deserunt nulla.
          Anim do qui et qui esse qui ex eu. Adipisicing dolor
          ea proident nostrud sint consequat consectetur up to 8 products.
        </div>
        <div class="controls">
          <UiButton
            class="create-products"
            @click="openSelectProductsModal"
            color="transparent-blue-thin-border"
            :isTransparent="true"
          >
            <IconPlus slot="iconBefore" />
            SELECT PRODUCTS
          </UiButton>
        </div>
      </section>
      <section v-if="createLink.projectId !== null">
        <div class="items-list">
          <UiTable>
            <UiTableRow :isHead="true">
              <UiTableCell width="40px" align="center"></UiTableCell>
              <UiTableCell width="350px" align="left">Name</UiTableCell>
              <UiTableCell width="200px" align="left">Virtual item</UiTableCell>
              <UiTableCell width="200px" align="left">Price</UiTableCell>
              <UiTableCell width="3%" align="left"></UiTableCell>
            </UiTableRow>
            <template v-if="productsItems.length">
              <UiTableRow
                class="content-row"
                v-for="(item, index) in productsItems"
                :key="item.id"
                :index="index"
              >
                <UiTableCell width="40px" align="center" valign="middle">
                  <div
                    v-if="item.images !== null"
                    :style="{ backgroundImage: `url(${item.images[0]})` }"
                    class="item-image">
                  </div>
                  <IconNoImage
                    v-else
                    class="item-image"
                    width="18"
                    height="18"
                    fill="#919699"
                  />
                </UiTableCell>
                <UiTableCell width="200px" align="left" valign="middle" :title="item.name.en">
                  <span class="cell-text vi-name">
                    {{ item.name.en }}
                  </span>
                </UiTableCell>
                <UiTableCell width="200px" align="left" valign="middle" :title="item.sku">
                  <span class="cell-text vi-name">{{ item.sku }}</span>
                </UiTableCell>
                <UiTableCell class="cell-price" width="110px" align="left" valign="middle"
                  :title="getItemPrice(item)"
                  >
                  <UiNoText v-if="!getItemPrice(item)" />
                  <span v-else class="cell-text">
                    {{ getItemPrice(item) }}
                  </span>
                </UiTableCell>
                <UiTableCell width="40px" align="center" valign="middle">
                  <span class="delete" @click="deleteProductInList(index)">
                    <IconDelete/>
                  </span>
                </UiTableCell>
              </UiTableRow>
            </template>
          </UiTable>
          <div class="no-products"  v-if="productsItems.length === 0">
            You don’t have any item yet
          </div>
        </div>
      </section>

      <div class="create">
        <UiButton
          :disabled="!isCreate"
          @click="create"
        >
          CREATE
        </UiButton>
      </div>

    </UiPanel>

    <UiDeleteModal
      v-if="isDeleteModalOpened"
      title="Delete product"
      closeButtonText="Cancel"
      @close="isDeleteModalOpened = false"
      @submit="deleteProduct"
    >
      Do aliquip labore dolor irure cillum deserunt nulla. Anim do qui et qui esse #product-name.
    </UiDeleteModal>

    <SelectProductsModal
      v-if="isSelectProductsModalOpened"
      v-model="productsItemsSelected"
      title="Select products"
      :value="productsItemsSelected"
      :items="productsListModal"
      :options="productsItemsOptions"
      @close="isSelectProductsModalOpened = false"
      @save="handleModalSave"
      @updated="updateSelectProducts"
    />
  </div>
</template>

<style lang="scss" scoped>
  .control-bar {
    display: flex;
    justify-content: space-between;
  }
  .expiration-date {
    width: 360px;
    &.ui-filter-date {
      max-width: 360px;
    }
    /deep/ .mx-input {
      border: none;
      border-bottom: 1px solid #E3E5E6;
    }
  }
  .section {
    &__header {
      margin-top: 32px;
    }
    &__info {
      width: 420px;
    }
  }
  .controls {
    margin: 28px 0;
  }
  .create-products {
    border: 1px solid #367BF5;
  }
  .no-products {
    width: 100%;
    font-size: 12px;
    line-height: 16px;
    color: #919699;
    padding: 12px;
    text-align: center;
  }
  .item-image {
    width: 18px;
    height: 18px;
    background-size: contain;
    margin-right: 10px;
    display: inline-block;
    vertical-align: middle;
  }
  .cell-price {
    color: #069697;
  }
  .delete {
    cursor: pointer;
    &:not(:hover) {
      & svg {
        fill: #C6CACC;
      }
    }
  }
  .create {
    justify-content: flex-end;
    display: flex;
    margin-top: 32px;
    & button {
      min-width: 140px;
      letter-spacing: 0.75px;
    }
  }
  .select-project {
    margin-top: 32px;
  }
</style>
