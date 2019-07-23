<script>
export default {
  name: 'YouDidGreatJob',
};
</script>

<template>
<div class="you-did-great-job">
  <IconCupAndPeople class="icon" />
  <UiHeader
    align="center"
    :hasMargin="true"
    level="2"
  >You did a great job!</UiHeader>
  <p class="text">
    Now we need a little bit more of your time to ask you a few<br>
    questions. It will greatly help us to improve your experience<br>
    from using our service.
  </p>
  <UiButton>CONTINUE</UiButton>
</div>
</template>

<style lang="scss" scoped>
.you-did-great-job {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon {
  margin-bottom: 24px;
}

.text {
  text-align: center;
  margin-bottom: 48px;
}
</style>
