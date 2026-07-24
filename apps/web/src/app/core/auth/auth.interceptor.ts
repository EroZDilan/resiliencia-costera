import { HttpInterceptorFn } from '@angular/common/http';

// TODO(auth-phase): no-op today. Once real auth exists, attach the JWT
// (e.g. `Authorization: Bearer <token>`) here for every outgoing request.
export const authInterceptor: HttpInterceptorFn = (req, next) => next(req);
