import Vue from 'vue';
import Vuelidate from 'vuelidate';
import { get, extend, includes } from 'lodash-es';

Vue.use(Vuelidate);

function $getFieldErrorMessages(fieldPath, errorsToExpose) {
  const field = get(this.$v, fieldPath);

  if (!field) {
    return '';
  }

  let errorNames = Object.keys(field.$params).filter(name => !field[name]);

  if (errorsToExpose) {
    errorNames = errorNames.filter(name => includes(errorsToExpose, name));
  }

  return errorNames.map((name) => {
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
