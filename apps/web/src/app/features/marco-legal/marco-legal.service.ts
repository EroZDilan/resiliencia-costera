import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateMarcoLegalPayload, MarcoLegal } from './marco-legal.model';

@Injectable({ providedIn: 'root' })
export class MarcoLegalService {
  private http = inject(HttpClient);
  private adminBase = `${environment.apiUrl}/admin/marco-legal`;
  private publicBase = `${environment.apiUrl}/public/marco-legal`;

  findAll(): Observable<MarcoLegal[]> {
    return this.http.get<MarcoLegal[]>(this.adminBase);
  }

  findAllPublic(): Observable<MarcoLegal[]> {
    return this.http.get<MarcoLegal[]>(this.publicBase);
  }

  findOne(id: number): Observable<MarcoLegal> {
    return this.http.get<MarcoLegal>(`${this.adminBase}/${id}`);
  }

  findBySlug(slug: string): Observable<MarcoLegal> {
    return this.http.get<MarcoLegal>(`${this.publicBase}/${slug}`);
  }

  create(payload: CreateMarcoLegalPayload): Observable<MarcoLegal> {
    return this.http.post<MarcoLegal>(this.adminBase, payload);
  }

  update(id: number, payload: CreateMarcoLegalPayload): Observable<MarcoLegal> {
    return this.http.patch<MarcoLegal>(`${this.adminBase}/${id}`, payload);
  }

  remove(id: number): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.adminBase}/${id}`);
  }
}
