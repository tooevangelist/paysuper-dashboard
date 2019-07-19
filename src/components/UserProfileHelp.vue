<script>
export default {
  name: 'UserProfileHelp',

  data() {
    return {

    };
  },
};
</script>

<template>
<div class="user-profile-basic">
  <UiHeader
    align="center"
    :hasMargin="true"
    level="2"
  >What can we do for you?</UiHeader>
  <p class="text">
    Tell us how we can help you. This will allow us to determine <br>
    the first steps of our future cooperation.
  </p>
  <div class="subtitle">Select one or more options:</div>
  <div class="form">
    <UiCheckbox class="checkbox">
      I need help with product promotion and development
    </UiCheckbox>
    <UiCheckbox class="checkbox">
      I need help with games promotion that have already been released
    </UiCheckbox>
    <UiCheckbox class="checkbox">
      I need help with international sales
    </UiCheckbox>
    <UiCheckbox class="checkbox">
     Other
    </UiCheckbox>
  </div>

</div>
</template>

<style lang="scss" scoped>
.user-profile-basic {
}

.text {
  text-align: center;
  margin-bottom: 32px;
}

.subtitle {
  font-size: 16px;
  line-height: 24px;
  color: #919699;
  margin-bottom: 16px;
}

.form {
}

.checkbox {
  display: block;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
  margin-bottom: 12px;
  margin-left: 12px;
}
</style>
