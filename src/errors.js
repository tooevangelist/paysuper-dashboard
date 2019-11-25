export const NOT_FOUND_ERROR = new Error('Entity not found');
export const UNAUTHORIZED = new Error('User is not authorized');
export const FORBIDDEN = new Error('Access is forbidden for the user');

export const errorCodesToNames = {
  401: UNAUTHORIZED,
  403: FORBIDDEN,
  404: NOT_FOUND_ERROR,
};

export const DEFAULT_CURRENCY_IS_NOT_SET = new Error(
  'Default currency is not set. Fill the banking info first',
);
