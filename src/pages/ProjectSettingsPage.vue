<script>
import ProjectFormSettings from '@/components/ProjectFormSettings.vue';

export default {
  name: 'ProjectSettingsPage',
  components: {
    ProjectFormSettings,
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
    uploadImage: {
      type: Function,
      required: true,
    },
    currencies: {
      required: true,
      type: Array,
    },
  },

  methods: {
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
      v-bind="$props"
      v-on="$listeners"
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
