export function onlyRusAndLat(value) {
  if (!value) {
    return true;
  }
  return /^[A-Za-zА-Яа-я0-9-]*$/.test(value);
}

export function wtf() {
  return '';
}
