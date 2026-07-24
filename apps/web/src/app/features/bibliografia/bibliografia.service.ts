import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Bibliografia, CreateBibliografiaPayload } from './bibliografia.model';

@Injectable({ providedIn: 'root' })
export class BibliografiaService {
  private http = inject(HttpClient);
  private adminBase = `${environment.apiUrl}/admin/bibliografia`;
  private publicBase = `${environment.apiUrl}/public/bibliografia`;

  findAll(): Observable<Bibliografia[]> {
    return this.http.get<Bibliografia[]>(this.adminBase);
  }

  findAllPublic(): Observable<Bibliografia[]> {
    return this.http.get<Bibliografia[]>(this.publicBase);
  }

  findOne(id: number): Observable<Bibliografia> {
    return this.http.get<Bibliografia>(`${this.adminBase}/${id}`);
  }

  findBySlug(slug: string): Observable<Bibliografia> {
    return this.http.get<Bibliografia>(`${this.publicBase}/${slug}`);
  }

  create(payload: CreateBibliografiaPayload): Observable<Bibliografia> {
    return this.http.post<Bibliografia>(this.adminBase, payload);
  }

  update(id: number, payload: CreateBibliografiaPayload): Observable<Bibliografia> {
    return this.http.patch<Bibliografia>(`${this.adminBase}/${id}`, payload);
  }

  remove(id: number): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.adminBase}/${id}`);
  }
}
