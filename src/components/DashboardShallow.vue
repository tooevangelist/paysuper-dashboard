<script>
export default {
  name: 'DashboardShallow',
};
</script>

<template>
<div class="template-dashboard-shallow">
  <slot />
</div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Quicksand:400,500|Roboto&display=swap");

.template-dashboard-shallow {
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #5e6366;

  & a {
    display: inline-block;
    text-decoration: none;
    color: #78909C;
    transition: color 0.2s ease-out;

    &:hover {
      text-decoration: none;
      color: #3d7bf5;
    }
  }
  & *,
  & *::before,
  & *::after {
    box-sizing: border-box;
  }
  & p {
    margin: 0;
  }
  & ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  & label {
    margin: 0;
  }
}
</style>
