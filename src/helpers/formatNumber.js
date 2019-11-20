export default function formatNumber(num, locale = 'en') {
  return new Intl.NumberFormat(locale).format(num.toFixed(2));
}
