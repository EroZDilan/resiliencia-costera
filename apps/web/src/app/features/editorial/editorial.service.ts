import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateEditorialPayload, Editorial } from './editorial.model';

@Injectable({ providedIn: 'root' })
export class EditorialService {
  private http = inject(HttpClient);
  private adminBase = `${environment.apiUrl}/admin/editoriales`;
  private publicBase = `${environment.apiUrl}/public/editoriales`;

  findAll(): Observable<Editorial[]> {
    return this.http.get<Editorial[]>(this.adminBase);
  }

  findAllPublic(): Observable<Editorial[]> {
    return this.http.get<Editorial[]>(this.publicBase);
  }

  findOne(id: number): Observable<Editorial> {
    return this.http.get<Editorial>(`${this.adminBase}/${id}`);
  }

  findBySlug(slug: string): Observable<Editorial> {
    return this.http.get<Editorial>(`${this.publicBase}/${slug}`);
  }

  create(payload: CreateEditorialPayload): Observable<Editorial> {
    return this.http.post<Editorial>(this.adminBase, payload);
  }

  update(id: number, payload: CreateEditorialPayload): Observable<Editorial> {
    return this.http.patch<Editorial>(`${this.adminBase}/${id}`, payload);
  }

  remove(id: number): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.adminBase}/${id}`);
  }
}
