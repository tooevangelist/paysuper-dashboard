export default function ({ store, redirect }) {
  const { user } = store.state;
  const cDate = new Date();

  if (user && user.accessToken && user.email && user.expire >= cDate.getTime()) {
    return undefined;
  }

  return redirect('/login');
}
