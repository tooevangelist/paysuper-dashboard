import { findKey, difference, keys } from 'lodash-es';

const merchantStatusScheme = {
  0: {
    label: 'New',
    color: 'blue',
    value: 'new',
  },
  7: {
    label: 'Pending',
    color: 'yellow',
    value: 'pending',
  },
  8: {
    label: 'Accepted',
    color: 'cyan',
    value: 'accepted',
  },
  3: {
    label: 'Signing',
    color: 'purple',
    value: 'signing',
  },
  4: {
    label: 'Signed',
    color: 'green',
    value: 'signed',
  },
  6: {
    label: 'Rejected',
    color: 'red',
    value: 'rejected',
  },
  5: {
    label: 'Archived',
    color: 'red',
    icon: 'IconArchive',
    value: 'archived',
  },
};

export const signedStatusCode = findKey(merchantStatusScheme, { value: 'signed' });
export const notSignedStatusCodes = difference(keys(merchantStatusScheme), [signedStatusCode]);
export default merchantStatusScheme;
