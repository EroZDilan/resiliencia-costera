import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateGlosarioPayload, Glosario } from './glosario.model';

@Injectable({ providedIn: 'root' })
export class GlosarioService {
  private http = inject(HttpClient);
  private adminBase = `${environment.apiUrl}/admin/glosario`;
  private publicBase = `${environment.apiUrl}/public/glosario`;

  findAll(): Observable<Glosario[]> {
    return this.http.get<Glosario[]>(this.adminBase);
  }

  findAllGroupedPublic(): Observable<Record<string, Glosario[]>> {
    return this.http.get<Record<string, Glosario[]>>(this.publicBase);
  }

  findOne(id: number): Observable<Glosario> {
    return this.http.get<Glosario>(`${this.adminBase}/${id}`);
  }

  create(payload: CreateGlosarioPayload): Observable<Glosario> {
    return this.http.post<Glosario>(this.adminBase, payload);
  }

  update(id: number, payload: CreateGlosarioPayload): Observable<Glosario> {
    return this.http.patch<Glosario>(`${this.adminBase}/${id}`, payload);
  }

  remove(id: number): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.adminBase}/${id}`);
  }
}
