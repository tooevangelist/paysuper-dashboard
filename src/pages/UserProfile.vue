<script>
import UserProfileBasic from '@/components/UserProfileBasic.vue';
import StepsProgressBar from '@/components/StepsProgressBar.vue';

export default {
  name: 'PageUserProfile',

  components: {
    UserProfileBasic,
    StepsProgressBar,
  },
};
</script>

<template>
<div class="user-profile">
  <div class="wrapper">
    <StepsProgressBar
      class="progress-bar"
      :stepsCount="3"
      :currentStep="1"
      currentStepName="About yourself"
     />
    <UserProfileBasic />
    <div class="controls">
      <UiButton>
        NEXT
      </UiButton>
    </div>
  </div>
</div>
</template>


<style lang="scss" scoped>
.user-profile {
}

.wrapper {
  width: 450px;
}

.progress-bar {
  margin-bottom: 48px;
}

.controls {
  display: flex;
  justify-content: flex-end;
}
</style>
