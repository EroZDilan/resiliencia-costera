import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateIncidenciaPayload, Incidencia, IncidenciaGrouped } from './incidencia.model';

@Injectable({ providedIn: 'root' })
export class IncidenciaService {
  private http = inject(HttpClient);
  private adminBase = `${environment.apiUrl}/admin/incidencias`;
  private publicBase = `${environment.apiUrl}/public/incidencias`;

  findAllGrouped(): Observable<IncidenciaGrouped> {
    return this.http.get<IncidenciaGrouped>(this.adminBase);
  }

  findOne(id: number): Observable<Incidencia> {
    return this.http.get<Incidencia>(`${this.adminBase}/${id}`);
  }

  atender(id: number): Observable<Incidencia> {
    return this.http.post<Incidencia>(`${this.adminBase}/${id}/atender`, {});
  }

  cerrar(id: number): Observable<Incidencia> {
    return this.http.post<Incidencia>(`${this.adminBase}/${id}/cerrar`, {});
  }

  reabrir(id: number): Observable<Incidencia> {
    return this.http.post<Incidencia>(`${this.adminBase}/${id}/reabrir`, {});
  }

  responder(id: number, respuesta: string, enviarCerrar: boolean): Observable<Incidencia> {
    return this.http.post<Incidencia>(`${this.adminBase}/${id}/responder`, { respuesta, enviarCerrar });
  }

  create(payload: CreateIncidenciaPayload): Observable<Incidencia> {
    return this.http.post<Incidencia>(this.publicBase, payload);
  }
}
