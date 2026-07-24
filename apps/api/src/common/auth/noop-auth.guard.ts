import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CURRENT_USER_PLACEHOLDER } from './current-user.decorator';

/**
 * TODO(auth-phase): this guard currently allows every request through and
 * exists only so every controller already has `@UseGuards`/`@Roles` wired up
 * and won't need touching again when real auth lands. Deferred by explicit
 * user request (business modules first). Still missing before this is
 * production-ready:
 *  - real JWT/session verification
 *  - role check against the AUTHENTICATED user (seg_usuario/seg_usuario_rol),
 *    not against a URL segment like the legacy PHP app does today
 *  - password hashing (bcrypt/argon2), account activation, password recovery
 *  - login throttling (today's PHP does 3 attempts / 5 min)
 */
@Injectable()
export class NoopAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    request.user = CURRENT_USER_PLACEHOLDER;
    return true;
  }
}
