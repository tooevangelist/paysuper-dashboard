export default function getStatusKey(status) {
  return {
    0: 'new',
    3: 'signing',
    4: 'signed',
    5: 'deleted',
  }[status];
}
