<script>
import { mapState, mapMutations } from 'vuex';
import ProjectFormSettings from '@/components/ProjectFormSettings.vue';

export default {
  name: 'ProjectSettingsPage',
  components: {
    ProjectFormSettings,
  },
  props: {
    uploadImage: {
      type: Function,
      required: true,
    },
  },

  computed: {
    ...mapState('Project', ['project', 'currencies']),
  },

  methods: {
    ...mapMutations('Project', { setCurrencies: 'currencies' }),

    handleSave() {
      const isValid = this.$refs.form.chekIsFormValid();
      if (isValid) {
        this.$emit('save');
      }
    },
  },
};
</script>

<template>
<div>
  <UiPageHeaderFrame>
    <span slot="title">Settings</span>
    <span slot="description">
      Setup main scope of project parameters here.
    </span>
    <!-- <PictureClock slot="picture" /> -->
  </UiPageHeaderFrame>

  <UiPanel>
    <ProjectFormSettings
      ref="form"
      v-bind="{
        uploadImage,
        currencies,
        project
      }"
      v-on="$listeners"
      @currenciesChange="setCurrencies"
    />

    <div class="controls">
      <UiButton
        class="submit-button"
        @click="handleSave"
        text="SAVE"
      />
    </div>
  </UiPanel>
</div>
</template>


<style lang="scss" scoped>
.controls {
  display: flex;
  justify-content: flex-end;
}

.submit-button {
  width: 140px;
}
</style>
