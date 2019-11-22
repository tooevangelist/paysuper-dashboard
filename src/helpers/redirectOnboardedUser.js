export default function redirectOnboardedUser(redirect, userPermissions) {
  if (userPermissions) {
    if (userPermissions.viewDashboard) {
      return redirect({ name: 'Dashboard' });
    }
    if (userPermissions.viewProjects) {
      return redirect({ name: 'ProjectsList' });
    }
    if (userPermissions.viewMerchantsList) {
      return redirect({ name: 'MerchantsList' });
    }
  }
  return undefined;
}
