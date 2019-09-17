export function onlyRusAndLat(value) {
  if (!value) {
    return true;
  }
  return /^[A-Za-zА-Яа-я- ]*$/.test(value);
}
export function onlyRusAndLatAndNum(value) {
  if (!value) {
    return true;
  }
  return /^[A-Za-zА-Яа-я0-9- ]*$/.test(value);
}
export function phone(value) {
  const regex = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/;
  return regex.test(value);
}
