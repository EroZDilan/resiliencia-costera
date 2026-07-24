import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface CurrentUser {
  id: number;
  username: string;
  roles: string[];
}

// TODO(auth-phase): stub — always reports a logged-in admin. Replace with
// real login/session handling once auth is prioritized.
const PLACEHOLDER_USER: CurrentUser = {
  id: 2,
  username: 'admin',
  roles: ['ROLE_SUPERADMINISTRADOR', 'ROLE_ADMINISTRADOR']
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  isLoggedIn(): boolean {
    return !environment.authEnabled || true;
  }

  currentUser(): CurrentUser {
    return PLACEHOLDER_USER;
  }

  hasRole(role: string): boolean {
    return this.currentUser().roles.includes(role);
  }
}
