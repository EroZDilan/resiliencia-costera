import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { FileUploadModule, FileUploadHandlerEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { EventoService } from '../../evento.service';
import { AdjuntoService, Adjunto } from '../../../../core/adjunto/adjunto.service';

@Component({
  selector: 'app-evento-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    DatePickerModule,
    FileUploadModule,
    ToastModule,
  ],
  providers: [MessageService],
  template: `
    <p-toast />
    <h2>{{ id ? 'Editar evento' : 'Nuevo evento' }}</h2>
    <form [formGroup]="form" (ngSubmit)="submit()" class="admin-form">
      <div class="admin-field">
        <label for="titulo">Texto *</label>
        <input pInputText id="titulo" formControlName="titulo" />
      </div>
      <div class="admin-field">
        <label for="descripcion">Descripción</label>
        <textarea pTextarea id="descripcion" formControlName="descripcion" rows="3"></textarea>
      </div>
      <div class="admin-field">
        <label for="fechaInicio">Fecha inicio del evento *</label>
        <p-datePicker id="fechaInicio" formControlName="fechaInicio" dateFormat="dd/mm/yy" />
      </div>
      <div class="admin-field">
        <label for="fechaFin">Fecha fin del evento *</label>
        <p-datePicker id="fechaFin" formControlName="fechaFin" dateFormat="dd/mm/yy" />
      </div>
      <div class="admin-field">
        <label for="fechaInicioPublicacion">Publicación desde *</label>
        <p-datePicker id="fechaInicioPublicacion" formControlName="fechaInicioPublicacion" dateFormat="dd/mm/yy" />
      </div>
      <div class="admin-field">
        <label for="fechaFinPublicacion">Publicación hasta *</label>
        <p-datePicker id="fechaFinPublicacion" formControlName="fechaFinPublicacion" dateFormat="dd/mm/yy" />
      </div>
      <div class="admin-field">
        <label for="web">Sitio web *</label>
        <input pInputText id="web" formControlName="web" />
      </div>
      <div class="admin-field">
        <label for="palabrasClaves">Palabras clave</label>
        <input pInputText id="palabrasClaves" formControlName="palabrasClaves" />
      </div>
      <div class="admin-field">
        <label>Imagen *</label>
        @if (imagen?.archivo) { <span>{{ imagen?.archivo }}</span> }
        <p-fileUpload mode="basic" chooseLabel="Subir imagen" accept="image/*"
                      [customUpload]="true" (uploadHandler)="uploadImagen($event)" [auto]="true" />
      </div>
      <div class="admin-form-actions">
        <button pButton type="button" label="Cancelar" class="p-button-text" routerLink="/admin/eventos"></button>
        <button pButton type="submit" label="Guardar" [loading]="saving"></button>
      </div>
    </form>
  `,
})
export class EventoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(EventoService);
  private adjuntos = inject(AdjuntoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(MessageService);

  id: number | null = null;
  saving = false;
  imagen: Adjunto | null = null;

  form = this.fb.nonNullable.group({
    titulo: ['', Validators.required],
    descripcion: [''],
    fechaInicio: this.fb.control<Date | null>(null, Validators.required),
    fechaFin: this.fb.control<Date | null>(null, Validators.required),
    fechaInicioPublicacion: this.fb.control<Date | null>(null, Validators.required),
    fechaFinPublicacion: this.fb.control<Date | null>(null, Validators.required),
    web: ['', Validators.required],
    palabrasClaves: [''],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.service.findOne(this.id).subscribe((item) => {
        this.form.patchValue({
          titulo: item.titulo,
          descripcion: item.descripcion ?? '',
          fechaInicio: new Date(item.fechaInicio),
          fechaFin: new Date(item.fechaFin),
          fechaInicioPublicacion: new Date(item.fechaInicioPublicacion),
          fechaFinPublicacion: new Date(item.fechaFinPublicacion),
          web: item.web,
          palabrasClaves: item.palabrasClaves ?? '',
        });
        this.imagen = item.imagen;
      });
    }
  }

  uploadImagen(event: FileUploadHandlerEvent): void {
    this.adjuntos.upload(event.files[0]).subscribe((adjunto) => (this.imagen = adjunto));
  }

  submit(): void {
    if (this.form.invalid || !this.imagen) {
      this.toast.add({ severity: 'warn', summary: 'Faltan datos', detail: !this.imagen ? 'Debe subir una imagen.' : 'Complete los campos requeridos.' });
      return;
    }
    this.saving = true;
    const raw = this.form.getRawValue();
    const payload = {
      ...raw,
      fechaInicio: raw.fechaInicio!.toISOString(),
      fechaFin: raw.fechaFin!.toISOString(),
      fechaInicioPublicacion: raw.fechaInicioPublicacion!.toISOString(),
      fechaFinPublicacion: raw.fechaFinPublicacion!.toISOString(),
      imagenId: this.imagen.id,
    };
    const request$ = this.id ? this.service.update(this.id, payload) : this.service.create(payload);
    request$.subscribe({
      next: () => this.router.navigate(['/admin/eventos']),
      error: (err) => {
        this.saving = false;
        this.toast.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? 'No se pudo guardar' });
      },
    });
  }
}
