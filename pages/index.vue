<template>
  <div class="container-fluid">
    <div class="row">
      <div class="d-flex align-items-center justify-content-center container">
        <nuxt-link
          type="button"
          class="btn btn-success align-middle"
          to="/login"
          active-class
          tag="button"
        >Sign In</nuxt-link>
        <nuxt-link
          type="button"
          class="btn btn-primary"
          to="/register"
          active-class
          tag="button"
        >Sign Up</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'login',
};
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;

  button {
    margin-right: 7px;
  }
}
</style>

