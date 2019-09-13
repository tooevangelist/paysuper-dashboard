import { get } from 'lodash-es';

export default function getMessageFromError(error, field = 'message') {
  if (typeof error === 'string') {
    return error;
  }

  const message = get(error, `response.data.error.${field}`)
    || get(error, `response.data.${field}`)
    || get(error, field);
  const defaultMessage = get(error, 'response.data.error.message')
    || get(error, 'response.data.message')
    || get(error, 'message');

  return message || defaultMessage;
}
