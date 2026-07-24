import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateIniciativaPayload, Iniciativa } from './iniciativa.model';

@Injectable({ providedIn: 'root' })
export class IniciativaService {
  private http = inject(HttpClient);
  private adminBase = `${environment.apiUrl}/admin/iniciativas`;
  private publicBase = `${environment.apiUrl}/public/iniciativas`;

  findAll(): Observable<Iniciativa[]> {
    return this.http.get<Iniciativa[]>(this.adminBase);
  }

  findAllPublic(): Observable<Iniciativa[]> {
    return this.http.get<Iniciativa[]>(this.publicBase);
  }

  findOne(id: number): Observable<Iniciativa> {
    return this.http.get<Iniciativa>(`${this.adminBase}/${id}`);
  }

  findBySlug(slug: string): Observable<Iniciativa> {
    return this.http.get<Iniciativa>(`${this.publicBase}/${slug}`);
  }

  create(payload: CreateIniciativaPayload): Observable<Iniciativa> {
    return this.http.post<Iniciativa>(this.adminBase, payload);
  }

  update(id: number, payload: Partial<CreateIniciativaPayload>): Observable<Iniciativa> {
    return this.http.patch<Iniciativa>(`${this.adminBase}/${id}`, payload);
  }

  remove(id: number): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.adminBase}/${id}`);
  }

  exportExcelUrl(): string {
    return `${this.adminBase}/export/excel`;
  }
}
