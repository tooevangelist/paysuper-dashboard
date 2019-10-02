export default function getStatusByKey(key) {
  return {
    new: 0,
    rejected: 0,
    signing: 3,
    signed: 4,
    deleted: 5,
  }[key];
}
