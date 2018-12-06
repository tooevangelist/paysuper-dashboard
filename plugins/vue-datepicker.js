import Vue from 'vue';
import vDatepicker from 'vue2-datepicker';

const VueDatepicker = {
    install(Vue, options) {
        Vue.component('v-datepicker', vDatepicker)
    }
};

Vue.use(VueDatepicker);
export default VueDatepicker;