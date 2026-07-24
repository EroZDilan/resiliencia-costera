import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateOrganizacionPayload, Organizacion } from './organizacion.model';

@Injectable({ providedIn: 'root' })
export class OrganizacionService {
  private http = inject(HttpClient);
  private adminBase = `${environment.apiUrl}/admin/organizaciones`;
  private publicBase = `${environment.apiUrl}/public/organizaciones`;

  findAll(): Observable<Organizacion[]> {
    return this.http.get<Organizacion[]>(this.adminBase);
  }

  findAllPublic(): Observable<Organizacion[]> {
    return this.http.get<Organizacion[]>(this.publicBase);
  }

  findOne(id: number): Observable<Organizacion> {
    return this.http.get<Organizacion>(`${this.adminBase}/${id}`);
  }

  findBySlug(slug: string): Observable<Organizacion> {
    return this.http.get<Organizacion>(`${this.publicBase}/${slug}`);
  }

  create(payload: CreateOrganizacionPayload): Observable<Organizacion> {
    return this.http.post<Organizacion>(this.adminBase, payload);
  }

  update(id: number, payload: Partial<CreateOrganizacionPayload>): Observable<Organizacion> {
    return this.http.patch<Organizacion>(`${this.adminBase}/${id}`, payload);
  }

  remove(id: number): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.adminBase}/${id}`);
  }
}
