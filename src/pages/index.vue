<template>
  <div class="container-fluid">
    <div class="row">
      <div class="d-flex align-items-center justify-content-center container">
        <router-link
          type="button"
          class="btn btn-success align-middle"
          to="/login"
          active-class
          tag="button"
        >Sign In</router-link>
        <router-link
          type="button"
          class="btn btn-primary"
          to="/register"
          active-class
          tag="button"
        >Sign Up</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
