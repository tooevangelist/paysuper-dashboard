export default function ({ store, redirect }) {
  if (store.state.user != null && store.state.accessToken && store.state.email) {
    return redirect('/merchant');
  }

  return undefined;
}
