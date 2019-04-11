export function toggleSort(sort, propName) {
  const searchExp = new RegExp(`(-)?${propName}`);
  let sortString = sort.join(',');

  const searchResult = searchExp.exec(sortString);
  if (!searchResult) {
    return [
      ...sortString.split(','),
      propName,
    ].filter(item => item);
  }
  if (searchResult[1]) {
    sortString = sortString.replace(searchExp, propName);
  } else {
    sortString = sortString.replace(searchExp, `-${propName}`);
  }

  return sortString.split(',');
}

export function getSortDirection(sort, propName) {
  const searchExp = new RegExp(`(-)?${propName}`);
  const sortString = sort.join(',');

  const searchResult = searchExp.exec(sortString);
  if (!searchResult) {
    return null;
  }
  if (searchResult[1]) {
    return 'desc';
  }
  return 'asc';
}
