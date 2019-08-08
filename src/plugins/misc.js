import Vue from 'vue';
import { extend } from 'lodash-es';

function $navigate(path, query = {}) {
  this.$router.push({ path, query });
}

extend(Vue.prototype, {
  $navigate,
});
