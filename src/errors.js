export const NOT_FOUND_ERROR = new Error('Entity not found');
export const UNAUTHORIZED = new Error('User is not authorized');

export const errorCodesToNames = {
  404: NOT_FOUND_ERROR,
  401: UNAUTHORIZED,
};
