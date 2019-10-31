<template>
<div class="container"></div>
</template>

<style lang="scss" scoped>
$border-width: 2px;
$default-position: 45deg;
$size: 20px;

.container {
  animation: {
    name: rotate;
    duration: 0.6s;
    timing-function: linear;
    iteration-count: infinite;
  }

  background-color: transparent;
  border-radius: $size / 2;
  border: $border-width solid #fff;
  border-top: $border-width solid #069697;
  box-sizing: border-box;
  display: inline-block;
  height: $size;
  transform: rotate($default-position);
  width: $size;
  vertical-align: top;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg + $default-position);
  }
}
</style>
