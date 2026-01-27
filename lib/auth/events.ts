export const ADMIN_AUTH_EVENT = 'admin-auth-changed';

export function emitAdminAuthChanged() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(ADMIN_AUTH_EVENT));
}
