import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { IncidenciaService } from '../../incidencia.service';
import { Incidencia } from '../../incidencia.model';

@Component({
  selector: 'app-incidencia-detail',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink, ButtonModule, TextareaModule, CheckboxModule, TagModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast />
    @if (item; as inc) {
      <div class="admin-header">
        <h2>Incidencia {{ inc.codigo }}</h2>
        <p-tag [value]="estadoLabel" [severity]="estadoSeverity" />
      </div>

      <section>
        <p><strong>Tipo:</strong> {{ inc.tipo }}</p>
        <p><strong>Reportado por:</strong> {{ inc.nombre }} ({{ inc.ocupacion }})</p>
        @if (inc.email) { <p><strong>Email:</strong> {{ inc.email }}</p> }
        @if (inc.telefono) { <p><strong>Teléfono:</strong> {{ inc.telefono }}</p> }
        <p><strong>Descripción:</strong> {{ inc.descripcion }}</p>
      </section>

      <section class="admin-form-actions" style="justify-content: flex-start; margin: 1rem 0;">
        @if (inc.estado === 'PENDIENTE') {
          <button pButton label="Atender" icon="pi pi-check" (click)="atender()"></button>
        }
        @if (inc.estado === 'EN_PROCESO') {
          <button pButton label="Cerrar" icon="pi pi-times" (click)="cerrar()"></button>
        }
        @if (inc.estado === 'CERRADO') {
          <button pButton label="Reabrir" icon="pi pi-refresh" (click)="reabrir()"></button>
        }
      </section>

      <section>
        <h3>Historial</h3>
        <ul>
          @for (h of inc.historias; track h.id) {
            <li>{{ h.fecha | date: 'short' }} — {{ h.historia }}</li>
          }
        </ul>
      </section>

      <section>
        <h3>Respuestas</h3>
        @for (r of inc.respuestas; track r.id) {
          <div style="border-left: 3px solid #ccc; padding-left: 0.75rem; margin-bottom: 0.75rem;">
            <p>{{ r.respuesta }}</p>
            <small>{{ r.fecha | date: 'short' }}</small>
          </div>
        }

        @if (inc.estado !== 'CERRADO') {
          <div class="admin-field" style="max-width: 560px;">
            <label for="respuesta">Nueva respuesta</label>
            <textarea pTextarea id="respuesta" [(ngModel)]="respuestaTexto" rows="4"></textarea>
            <div style="display:flex; align-items:center; gap:0.5rem; margin-top: 0.5rem;">
              <p-checkbox [(ngModel)]="enviarCerrar" [binary]="true" inputId="enviarCerrar" />
              <label for="enviarCerrar">Cerrar la incidencia al responder</label>
            </div>
            <button pButton label="Enviar respuesta" icon="pi pi-send" style="margin-top:0.5rem;" (click)="responder()"></button>
          </div>
        }
      </section>

      <button pButton label="Volver" class="p-button-text" routerLink="/admin/incidencias"></button>
    }
  `,
})
export class IncidenciaDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(IncidenciaService);
  private toast = inject(MessageService);

  item: Incidencia | null = null;
  respuestaTexto = '';
  enviarCerrar = false;

  get estadoLabel(): string {
    return this.item ? { PENDIENTE: 'Pendiente', EN_PROCESO: 'En proceso', CERRADO: 'Cerrado' }[this.item.estado] : '';
  }

  get estadoSeverity(): 'warn' | 'info' | 'success' {
    if (!this.item) return 'info';
    return this.item.estado === 'PENDIENTE' ? 'warn' : this.item.estado === 'EN_PROCESO' ? 'info' : 'success';
  }

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.findOne(id).subscribe((item) => (this.item = item));
  }

  atender(): void {
    this.service.atender(this.item!.id).subscribe((item) => (this.item = item));
  }

  cerrar(): void {
    this.service.cerrar(this.item!.id).subscribe((item) => (this.item = item));
  }

  reabrir(): void {
    this.service.reabrir(this.item!.id).subscribe((item) => (this.item = item));
  }

  responder(): void {
    if (!this.respuestaTexto.trim()) return;
    this.service.responder(this.item!.id, this.respuestaTexto, this.enviarCerrar).subscribe((item) => {
      this.item = item;
      this.respuestaTexto = '';
      this.enviarCerrar = false;
      this.toast.add({ severity: 'success', summary: 'Respuesta enviada' });
    });
  }
}
