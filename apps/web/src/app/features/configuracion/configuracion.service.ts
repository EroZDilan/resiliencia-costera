import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Configuracion, UpdateConfiguracionPayload } from './configuracion.model';

@Injectable({ providedIn: 'root' })
export class ConfiguracionService {
  private http = inject(HttpClient);
  private adminBase = `${environment.apiUrl}/admin/configuracion`;
  private publicBase = `${environment.apiUrl}/public/configuracion`;

  get(): Observable<Configuracion> {
    return this.http.get<Configuracion>(this.adminBase);
  }

  getPublic(): Observable<Configuracion> {
    return this.http.get<Configuracion>(this.publicBase);
  }

  update(payload: UpdateConfiguracionPayload): Observable<Configuracion> {
    return this.http.patch<Configuracion>(this.adminBase, payload);
  }
}
