import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateNoticiaPayload, Noticia, ScrapedNoticia } from './noticia.model';

@Injectable({ providedIn: 'root' })
export class NoticiaService {
  private http = inject(HttpClient);
  private adminBase = `${environment.apiUrl}/admin/noticias`;
  private publicBase = `${environment.apiUrl}/public/noticias`;

  findAll(): Observable<Noticia[]> {
    return this.http.get<Noticia[]>(this.adminBase);
  }

  findAllPublic(): Observable<Noticia[]> {
    return this.http.get<Noticia[]>(this.publicBase);
  }

  findOne(id: number): Observable<Noticia> {
    return this.http.get<Noticia>(`${this.adminBase}/${id}`);
  }

  findBySlug(slug: string): Observable<Noticia> {
    return this.http.get<Noticia>(`${this.publicBase}/${slug}`);
  }

  scrape(url: string): Observable<ScrapedNoticia> {
    return this.http.get<ScrapedNoticia>(`${this.adminBase}/scrape`, { params: { url } });
  }

  create(payload: CreateNoticiaPayload): Observable<Noticia> {
    return this.http.post<Noticia>(this.adminBase, payload);
  }

  update(id: number, payload: CreateNoticiaPayload): Observable<Noticia> {
    return this.http.patch<Noticia>(`${this.adminBase}/${id}`, payload);
  }

  remove(id: number): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.adminBase}/${id}`);
  }
}
