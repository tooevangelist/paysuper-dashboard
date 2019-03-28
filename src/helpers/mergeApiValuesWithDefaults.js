import { mapValues, merge } from 'lodash-es';

function replaceDataEmptyValuesWithDefaults(data, defaultData) {
  return mapValues(data, (value, key) => {
    const defaultValue = defaultData[key];
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

export default function mergeApiValuesWithDefaults(defaultData, data) {
  const newData = merge({}, defaultData, data);

  return replaceDataEmptyValuesWithDefaults(newData, defaultData);
}
