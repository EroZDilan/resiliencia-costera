import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateColaboracionPayload, Colaboracion } from './colaboracion.model';

@Injectable({ providedIn: 'root' })
export class ColaboracionService {
  private http = inject(HttpClient);
  private adminBase = `${environment.apiUrl}/admin/colaboraciones`;
  private publicBase = `${environment.apiUrl}/public/colaboraciones`;

  findAll(): Observable<Colaboracion[]> {
    return this.http.get<Colaboracion[]>(this.adminBase);
  }

  findAllPublic(): Observable<Colaboracion[]> {
    return this.http.get<Colaboracion[]>(this.publicBase);
  }

  findOne(id: number): Observable<Colaboracion> {
    return this.http.get<Colaboracion>(`${this.adminBase}/${id}`);
  }

  findBySlug(slug: string): Observable<Colaboracion> {
    return this.http.get<Colaboracion>(`${this.publicBase}/${slug}`);
  }

  create(payload: CreateColaboracionPayload): Observable<Colaboracion> {
    return this.http.post<Colaboracion>(this.adminBase, payload);
  }

  update(id: number, payload: CreateColaboracionPayload): Observable<Colaboracion> {
    return this.http.patch<Colaboracion>(`${this.adminBase}/${id}`, payload);
  }

  remove(id: number): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.adminBase}/${id}`);
  }
}
