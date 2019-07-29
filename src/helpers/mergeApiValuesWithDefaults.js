import { mapValues, merge } from 'lodash-es';

function replaceDataEmptyValuesWithDefaults(defaultData, data) {
  return mapValues(defaultData, (value, key) => {
    const defaultValue = data[key];
    if (value) {
      if (typeof value === 'object' && !Array.isArray(value) && defaultValue) {
        return replaceDataEmptyValuesWithDefaults(value, defaultValue);
      }
    }

    if (value === null) {
      return defaultValue;
    }

    return value;
  });
}

export default function mergeApiValuesWithDefaults(data, defaultData) {
  const newData = merge({}, data, defaultData);

  return replaceDataEmptyValuesWithDefaults(newData, data);
}
