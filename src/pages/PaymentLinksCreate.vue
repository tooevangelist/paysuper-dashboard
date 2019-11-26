<script>
import { mapActions } from 'vuex';
import { maxLength, required } from 'vuelidate/lib/validators';

export default {
  name: 'PaymentLinksCreate',
  validations: {
    createLink: {
      name: { maxLength: maxLength(256), required },
      dateInput: { maxLength: maxLength(60), required },
    },
  },
  data() {
    return {
      createLink: {
        name: '',
        dateInput: null,
      },
      noExpirationDate: false,
      isSelectProductsModalOpened: false,
      productsItems: {
        items: [],
      },
    };
  },

  methods: {
    ...mapActions(['setIsLoading']),

    updateField() {
      console.log('update');
    },

    handleSetDate(value) {
      console.log(value);
      this.createLink.dateInput = value;
    },
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
      </section>
      <section class="section">
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
            @click="isSelectProductsModalOpened = true"
            color="transparent-blue-thin-border"
            :isTransparent="true"
          >
            <IconPlus slot="iconBefore" />
            SELECT PRODUCTS
          </UiButton>
        </div>
      </section>
      <section>
        <div class="items-list">
          <UiTable>
            <UiTableRow :isHead="true">
              <UiTableCell width="40px" align="center"></UiTableCell>
              <UiTableCell width="350px" align="left">Name</UiTableCell>
              <UiTableCell width="200px" align="left">Virtual item</UiTableCell>
              <UiTableCell width="200px" align="left">Price</UiTableCell>
              <UiTableCell width="3%" align="left"></UiTableCell>
            </UiTableRow>
            <template v-if="productsItems.items.length">
              <UiTableRow
                class="content-row"
                v-for="(item, index) in productsItems.items"
                :key="item.id"
              >
                <UiTableCell width="40px" align="center" valign="middle">

                </UiTableCell>
              </UiTableRow>
            </template>
          </UiTable>
          <div class="no-products"  v-if="productsItems.items.length === 0">
            You don’t have any item yet
          </div>
        </div>
      </section>
    </UiPanel>
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
</style>
