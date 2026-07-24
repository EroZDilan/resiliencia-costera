import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateFaqPayload, Faq } from './faq.model';

@Injectable({ providedIn: 'root' })
export class FaqService {
  private http = inject(HttpClient);
  private adminBase = `${environment.apiUrl}/admin/faq`;
  private publicBase = `${environment.apiUrl}/public/faq`;

  findAll(): Observable<Faq[]> {
    return this.http.get<Faq[]>(this.adminBase);
  }

  findAllPublic(): Observable<Faq[]> {
    return this.http.get<Faq[]>(this.publicBase);
  }

  findOne(id: number): Observable<Faq> {
    return this.http.get<Faq>(`${this.adminBase}/${id}`);
  }

  create(payload: CreateFaqPayload): Observable<Faq> {
    return this.http.post<Faq>(this.adminBase, payload);
  }

  update(id: number, payload: CreateFaqPayload): Observable<Faq> {
    return this.http.patch<Faq>(`${this.adminBase}/${id}`, payload);
  }

  remove(id: number): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.adminBase}/${id}`);
  }
}
