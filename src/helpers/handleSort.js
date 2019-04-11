export function toggleSort(sort, propName) {
  const searchExp = new RegExp(`(-)?${propName}`);
  let sortString = sort.join(',');

  if (searchExp.exec(sortString)[1]) {
    sortString = sortString.replace(searchExp, propName);
  } else {
    sortString = sortString.replace(searchExp, `-${propName}`);
  }

  return sortString.split(',');
}

export function getSortDirection(sort, propName) {
  const searchExp = new RegExp(`(-)?${propName}`);
  const sortString = sort.join(',');

  if (searchExp.exec(sortString)[1]) {
    return 'desc';
  }
  return 'asc';
}
