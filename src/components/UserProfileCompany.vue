<script>
export default {
  name: 'UserProfileCompany',

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
  >Tell us about your company and games</UiHeader>
  <p class="text">
    A few more questions about your business in order <br>
    to determine the planned scope of work and allocate <br>
    the necessary resources in advance.
  </p>
</div>
</template>

<style lang="scss" scoped>
.user-profile-basic {
}

.text {
  text-align: center;
}
</style>
