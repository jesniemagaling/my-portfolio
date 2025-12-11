export function isAdminLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;

  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('admin_token='));

  return cookie?.split('=')[1] === 'authenticated';
}
