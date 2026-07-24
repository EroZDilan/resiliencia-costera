import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateProyectoPayload, EstadoProyecto, Proyecto, ProyectoLugar } from './proyecto.model';

@Injectable({ providedIn: 'root' })
export class ProyectoService {
  private http = inject(HttpClient);
  private adminBase = `${environment.apiUrl}/admin/proyectos`;
  private publicBase = `${environment.apiUrl}/public/proyectos`;

  findAll(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(this.adminBase);
  }

  findAllPublic(estado?: EstadoProyecto): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(this.publicBase, { params: estado ? { estado } : {} });
  }

  findOne(id: number): Observable<Proyecto> {
    return this.http.get<Proyecto>(`${this.adminBase}/${id}`);
  }

  findBySlug(slug: string): Observable<Proyecto> {
    return this.http.get<Proyecto>(`${this.publicBase}/${slug}`);
  }

  create(payload: CreateProyectoPayload): Observable<Proyecto> {
    return this.http.post<Proyecto>(this.adminBase, payload);
  }

  update(id: number, payload: Partial<CreateProyectoPayload>): Observable<Proyecto> {
    return this.http.patch<Proyecto>(`${this.adminBase}/${id}`, payload);
  }

  remove(id: number): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.adminBase}/${id}`);
  }

  exportExcelUrl(): string {
    return `${this.adminBase}/export/excel`;
  }

  findLugares(proyectoId: number): Observable<ProyectoLugar[]> {
    return this.http.get<ProyectoLugar[]>(`${this.adminBase}/${proyectoId}/lugares`);
  }

  createLugar(proyectoId: number, dto: { nombre: string; geometria: string }): Observable<ProyectoLugar> {
    return this.http.post<ProyectoLugar>(`${this.adminBase}/${proyectoId}/lugares`, dto);
  }

  removeLugar(proyectoId: number, id: number): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.adminBase}/${proyectoId}/lugares/${id}`);
  }
}
