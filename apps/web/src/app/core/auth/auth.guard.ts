import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

// TODO(auth-phase): always allows navigation for now. Wired into admin
// routes from day one so routing won't need touching once real auth lands.
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isLoggedIn();
};
