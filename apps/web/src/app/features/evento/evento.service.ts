import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateEventoPayload, Evento } from './evento.model';

@Injectable({ providedIn: 'root' })
export class EventoService {
  private http = inject(HttpClient);
  private adminBase = `${environment.apiUrl}/admin/eventos`;
  private publicBase = `${environment.apiUrl}/public/eventos`;

  findAll(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.adminBase);
  }

  findAllPublic(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.publicBase);
  }

  findOne(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.adminBase}/${id}`);
  }

  findBySlug(slug: string): Observable<Evento> {
    return this.http.get<Evento>(`${this.publicBase}/${slug}`);
  }

  create(payload: CreateEventoPayload): Observable<Evento> {
    return this.http.post<Evento>(this.adminBase, payload);
  }

  update(id: number, payload: CreateEventoPayload): Observable<Evento> {
    return this.http.patch<Evento>(`${this.adminBase}/${id}`, payload);
  }

  remove(id: number): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.adminBase}/${id}`);
  }
}
