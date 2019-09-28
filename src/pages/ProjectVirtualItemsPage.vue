<template>
  <div>
    <SimplePageHeader tag="testing">
      <template slot="title">
        Virtual items
      </template>
      <span slot="description">
      This sales option will allow you to sell your Virtual Items, like <b>swords, guns,
        helmets</b> and virtual currency packs.
    </span>
      <PictureWoomanLooking slot="picture"/>
    </SimplePageHeader>

    <UiPanel>
      <div class="control-bar">
        <UiSearchField></UiSearchField>
        <UiButton text="ADD ITEM"></UiButton>
      </div>
      <div class="items-list">
        <NoResults type="add-new">You don’t have any item yet</NoResults>
      </div>
    </UiPanel>
  </div>
</template>

<script>
import SimplePageHeader from '@/components/SimplePageHeader.vue';
import PictureWoomanLooking from '@/components/PictureWomanLooking.vue';
import UiSearchField from '@/components/UiSearchField.vue';
import NoResults from '@/components/NoResults.vue';
import { mapActions } from 'vuex';

export default {
  name: 'ProjectVirtualItemsPage',

  components: {
    NoResults,
    UiSearchField,
    SimplePageHeader,
    PictureWoomanLooking,
  },

  props: {
    project: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      virtualItems: [],
    };
  },

  created() {
    this.fetchProducts({
      project_id: this.project.id,
      merchant_id: this.project.merchant_id,
    })
      .then((data) => {
        this.virtualItems = data;
      });
  },

  methods: {
    ...mapActions('Products', ['fetchProducts']),
  },
};
</script>

<style lang="scss" scoped>
.control-bar {
  display: flex;
  justify-content: space-between;
}
</style>
