import { reduce } from 'lodash-es';

export default function prepareActiveFields(item, activeFieldNames) {
  return reduce(
    activeFieldNames,
    (resProps, fieldName) => ({
      ...resProps,
      [fieldName]: {
        value: item[fieldName],
        hasChanges: false,
        hasError: false,
        hasFocus: false,
      },
    }),
    {},
  );
}
