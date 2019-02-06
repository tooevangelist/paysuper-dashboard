<template>
  <div>
    <sign-up></sign-up>
  </div>
</template>

<script>
import SignUp from '../components/SignUp.vue';

export default {
  components: { SignUp },
  layout: 'login',
  head: {
    title: 'SignUp page',
  },
};
</script>
