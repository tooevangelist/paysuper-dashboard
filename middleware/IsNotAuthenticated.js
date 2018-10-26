export default function ({ store, redirect }) {
    let user = store.state.user;
    const cDate = new Date();

    if (user && user.hasOwnProperty('accessToken')
        && user.hasOwnProperty('email') && user.expire >= cDate.getTime()) {
        return;
    }

    return redirect('/login');
}