import { findKey, omit } from 'lodash-es';

const merchantStatusScheme = {
  0: {
    label: 'New',
    color: 'blue',
    value: 'new',
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
  7: {
    label: 'Pending',
    color: 'yellow',
    value: 'pending',
  },
  8: {
    label: 'Accepted',
    color: 'teal',
    value: 'accepted',
  },
  5: {
    label: 'Archived',
    color: 'red',
    icon: 'IconArchive',
    value: 'archived',
  },
};

export const signedStatusCode = findKey(merchantStatusScheme, { value: 'signed' });
export const notSignedStatusCodes = Object.keys(omit(merchantStatusScheme, [signedStatusCode]));
export default merchantStatusScheme;
