export default {
  0: {
    text: 'Status',
    value: 'status',
    expand: false,
    children: [
      {
        text: 'All transactions',
        value: 'all',
      },
      {
        text: 'Created',
        value: 'created',
        color: 'blue',
      },
      {
        text: 'Pending',
        value: 'pending',
        color: 'yellow',
      },
      {
        text: 'Processed',
        value: 'processed',
        color: 'green',
      },
      {
        text: 'Refunded',
        value: 'refunded',
        color: 'red',
      },
      {
        text: 'Chargeback',
        value: 'chargeback',
        color: 'red',
      },
      {
        text: 'Rejected',
        value: 'rejected',
        color: 'transparent',
      },
      {
        text: 'Canceled',
        value: 'canceled',
        color: 'transparent',
      },
    ],
  },
  1: {
    text: 'Clear filter',
    value: 'all',
    color: 'archieved ',
  },
};
