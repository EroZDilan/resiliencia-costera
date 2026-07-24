import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateProvinciaPayload, Provincia } from './provincia.model';

@Injectable({ providedIn: 'root' })
export class ProvinciaService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/admin/provincias`;

  findAll(): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(this.base);
  }

  findOne(id: number): Observable<Provincia> {
    return this.http.get<Provincia>(`${this.base}/${id}`);
  }

  create(payload: CreateProvinciaPayload): Observable<Provincia> {
    return this.http.post<Provincia>(this.base, payload);
  }

  update(id: number, payload: CreateProvinciaPayload): Observable<Provincia> {
    return this.http.patch<Provincia>(`${this.base}/${id}`, payload);
  }

  remove(id: number): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.base}/${id}`);
  }
}
