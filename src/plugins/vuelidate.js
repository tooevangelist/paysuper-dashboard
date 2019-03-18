import Vue from 'vue';
import Vuelidate from 'vuelidate';
import { get, extend } from 'lodash-es';

Vue.use(Vuelidate);

function $getFieldErrorMessages(fieldPath) {
  const field = get(this.$v, fieldPath);

  if (!field) {
    return '';
  }

  return Object.keys(field.$params).filter(name => !field[name])
    .map((name) => {
      const message = this.$t(`errorMessages.${name}`);
      const params = field.$params[name];
      return message.replace(/%(.+?)%/g, (a, variable) => params[variable]);
    }).join(', ');
}

function $isFieldInvalid(fieldPath) {
  const field = get(this.$v, fieldPath);
  if (!field) {
    return false;
  }
  return Boolean(field.$invalid && field.$dirty);
}

extend(Vue.prototype, {
  $getFieldErrorMessages,
  $isFieldInvalid,
});
