<script>
export default {
  name: 'UserProfileBasic',

  data() {
    return {
      positionOptions: [
        {
          label: 'Разработка',
          value: '11',
        },
        {
          label: 'Реклама\\Маркетинг',
          value: '22',
        },
        {
          label: 'CEO',
          value: '33',
        },
        {
          label: 'CTO',
          value: '44',
        },
        {
          label: 'Развитие бизнеса',
          value: '55',
        },
        {
          label: '???',
          value: '66',
        },
      ],
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
  >Tell us about yourself</UiHeader>
  <p class="text">
    We look forward to getting to know you a little better. <br>
    Please tell us how to contact you and what role you play in <br>
    your company.
  </p>
  <UiTextField label="First name" />
  <UiTextField label="Last name" />
  <UiSelect label="Your position or role" :options="positionOptions" />
</div>
</template>

<style lang="scss" scoped>
.user-profile-basic {
}

.text {
  text-align: center;
}
</style>
