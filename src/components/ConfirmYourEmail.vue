<script>
export default {
  name: 'ConfirmYourEmail',
};
</script>

<template>
<div class="confirm-your-email">
  <IconBigMailbox class="icon" />
  <UiHeader
    align="center"
    :hasMargin="true"
    level="2"
  >Confirm your email</UiHeader>
  <p class="text">
    Thank you for telling us about your company. We sent you <br>
    a letter. Please check your email and follow the link in <br>
    the email to confirm your registration.
  </p>
</div>
</template>

<style lang="scss" scoped>
.confirm-your-email {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon {
  margin-bottom: 35px;
}

.text {
  text-align: center;
}
</style>
