import { get } from 'lodash-es';

export default function getMessageFromError(error) {
  if (typeof error === 'string') {
    return error;
  }
  return (
    get(error, 'response.data.error.message')
    || get(error, 'response.data.message')
    || get(error, 'message')
  );
}
