import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateMunicipioPayload, Municipio } from './municipio.model';

@Injectable({ providedIn: 'root' })
export class MunicipioService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/admin/municipios`;

  findAll(): Observable<Municipio[]> {
    return this.http.get<Municipio[]>(this.base);
  }

  findOne(id: number): Observable<Municipio> {
    return this.http.get<Municipio>(`${this.base}/${id}`);
  }

  create(payload: CreateMunicipioPayload): Observable<Municipio> {
    return this.http.post<Municipio>(this.base, payload);
  }

  update(id: number, payload: CreateMunicipioPayload): Observable<Municipio> {
    return this.http.patch<Municipio>(`${this.base}/${id}`, payload);
  }

  remove(id: number): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.base}/${id}`);
  }
}
