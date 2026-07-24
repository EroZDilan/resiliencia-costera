import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

// TODO(auth-phase): currently ignored by NoopAuthGuard. Declared now so
// controllers don't need to change again once the guard enforces it.
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
