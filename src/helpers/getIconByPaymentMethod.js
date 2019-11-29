import {
  camelCase,
  includes,
  lowerCase,
  toLower,
  upperFirst,
} from 'lodash-es';

export default function getIconByPaymentMethod(method) {
  if (includes(lowerCase(method), 'union pay')) {
    return 'IconUnionPay';
  }
  if (includes(lowerCase(method), 'ali pay')) {
    return 'IconAliPay';
  }

  return `Icon${upperFirst(camelCase(toLower(method)))}`;
}
