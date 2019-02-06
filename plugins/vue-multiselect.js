import Vue from 'vue';
import vMultiSelect from 'vue-multiselect';

const VueMultiSelect = {
  install(Vue, options) {
    Vue.component('v-multiselect', vMultiSelect);
  },
};

Vue.use(VueMultiSelect);
export default vMultiSelect;
