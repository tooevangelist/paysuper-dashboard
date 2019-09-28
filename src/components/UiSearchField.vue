<template>
  <div class="search-field">
    <input type="search"
       v-model="inputValue"
       @blur="$emit('blur')"
       @focus="$emit('focus')"
       @input="$emit('input', inputValue)"
       :placeholder="placeholder">
    <div class="search-field__ico">
      <IconLens />
    </div>
  </div>
</template>

<script>
export default {
  name: 'UiSearchField',

  props: {
    placeholder: {
      default: 'Search',
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
.search-field {
  position: relative;
  width: 280px;

  input {
    border: 1px solid #E3E5E6;
    box-sizing: border-box;
    border-radius: 4px;
    padding: 10px 25px 9px 12px;
    width:  100%;

    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.25px;

    &::-ms-clear {
      width : 0;
      height: 0;
    }
  }

  input[type="search"]::-webkit-search-decoration,
  input[type="search"]::-webkit-search-cancel-button,
  input[type="search"]::-webkit-search-results-button,
  input[type="search"]::-webkit-search-results-decoration { display: none; }

  &__ico {
    position: absolute;
    right: 13.5px;
    top: 11px;
  }
}
</style>
