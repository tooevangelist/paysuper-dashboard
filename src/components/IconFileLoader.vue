<template>
<section>
  <div class="sk-fading-circle">
    <div
      v-for="index in 12"
      :key="index"
      :class="['sk-circle', `sk-circle-${index}`]"
    ></div>
  </div>
</section>
</template>

<style lang="scss" scoped>
.sk-fading-circle {
  $circleCount: 12;
  $animationDuration: 1.2s;
  $spinkit-size: 30px;
  $spinkit-spinner-color: #3d7bf5;

  width: $spinkit-size;
  height: $spinkit-size;
  position: relative;
  margin: auto;

  .sk-circle {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  .sk-circle:before {
    content: '';
    display: block;
    margin: 0 auto;
    width: 15%;
    height: 15%;
    background-color: $spinkit-spinner-color;
    border-radius: 100%;
    animation: sk-fading-circle-delay $animationDuration infinite ease-in-out both;
  }

  @for $i from 2 through $circleCount {
    .sk-circle-#{$i} {
      transform: rotate((360deg / $circleCount * ($i - 1)));
    }
  }

  @for $i from 2 through $circleCount {
    .sk-circle-#{$i}:before {
      animation-delay: (-$animationDuration + $animationDuration / $circleCount * ($i - 1));
    }
  }
}
@keyframes sk-fading-circle-delay {
  0%, 39%, 100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
}
</style>
