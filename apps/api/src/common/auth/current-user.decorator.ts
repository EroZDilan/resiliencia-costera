import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUser {
  id: number;
  username: string;
  roles: string[];
}

// TODO(auth-phase): replace with the real authenticated user once auth lands.
// id:2 ("admin") is a real seg_usuario row — several FKs (incidencia.atendida_por,
// incidencia_historia.hecho_por, incidencia_respuesta.respondida_por) reference
// seg_usuario, so the placeholder must point at a row that actually exists.
export const CURRENT_USER_PLACEHOLDER: CurrentUser = {
  id: 2,
  username: 'admin',
  roles: ['ROLE_SUPERADMINISTRADOR', 'ROLE_ADMINISTRADOR'],
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user ?? CURRENT_USER_PLACEHOLDER;
  },
);
