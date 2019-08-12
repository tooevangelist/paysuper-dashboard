<template>
  <div class="page-error">
    <p class="code">{{errorCode}}</p>
    <p class="text">{{errorText}}</p>
  </div>
</template>

<script>
const errorTexts = {
  404: 'Page not found',
  500: 'Server error',
  520: 'Unknown error',
};

export default {
  name: 'ErrorPage',

  props: {
    errorCode: {
      required: true,
      type: Number,
    },
  },

  computed: {
    errorText() {
      return errorTexts[this.errorCode];
    },
  },
};
</script>

<style lang="scss" scoped>
.page-error {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  line-height: 40px;
}

.code {
  font-size: 40px;
  font-weight: bold;
}

.text {
  text-transform: uppercase;
  font-size: 20px;
}
</style>
