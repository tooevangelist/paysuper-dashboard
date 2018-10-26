export default function ({ store, redirect }) {
    if (store.state.user != null && store.state.hasOwnProperty('accessToken')
        && store.state.hasOwnProperty('email')) {
        return redirect('/merchant');
    }
}