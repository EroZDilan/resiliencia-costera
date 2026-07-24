import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Adjunto {
  id: number;
  archivo: string | null;
  ruta: string | null;
  archivoHash: string | null;
  size: number;
  mimeType: string | null;
}

@Injectable({ providedIn: 'root' })
export class AdjuntoService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/admin/adjuntos`;

  upload(file: File): Observable<Adjunto> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<Adjunto>(this.base, form);
  }

  url(adjunto: Adjunto | null | undefined): string | null {
    if (!adjunto?.archivoHash) return null;
    return `${environment.apiUrl}/uploads/${adjunto.archivoHash}`;
  }
}
