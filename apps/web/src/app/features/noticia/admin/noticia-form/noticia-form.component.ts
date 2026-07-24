import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { FileUploadModule, FileUploadHandlerEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NoticiaService } from '../../noticia.service';
import { AdjuntoService, Adjunto } from '../../../../core/adjunto/adjunto.service';

// Mirrors legacy DD-MM-YYYY parsing back into a Date for the fecha field.
function parseLegacyDate(value: string): Date {
  const [day, month, year] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

@Component({
  selector: 'app-noticia-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
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
    <h2>{{ id ? 'Editar noticia' : 'Nueva noticia' }}</h2>

    <div class="admin-field" style="max-width:560px; margin-bottom:1rem;">
      <label for="scrapeUrl">URL de origen (autocompletar desde metadatos OpenGraph)</label>
      <div style="display:flex; gap:0.5rem;">
        <input pInputText id="scrapeUrl" [(ngModel)]="scrapeUrl" [ngModelOptions]="{standalone: true}" style="flex:1" />
        <button pButton type="button" label="Autocompletar" icon="pi pi-download" [loading]="scraping" (click)="scrape()"></button>
      </div>
    </div>

    <form [formGroup]="form" (ngSubmit)="submit()" class="admin-form">
      <div class="admin-field">
        <label for="titulo">Texto *</label>
        <input pInputText id="titulo" formControlName="titulo" />
      </div>
      <div class="admin-field">
        <label for="resumen">Resumen *</label>
        <textarea pTextarea id="resumen" formControlName="resumen" rows="4"></textarea>
      </div>
      <div class="admin-field">
        <label for="fecha">Fecha *</label>
        <p-datePicker id="fecha" formControlName="fecha" dateFormat="dd/mm/yy" />
      </div>
      <div class="admin-field">
        <label for="url">URL de origen *</label>
        <input pInputText id="url" formControlName="url" />
      </div>
      <div class="admin-field">
        <label>Imagen (subida local, opcional si hay imagen externa)</label>
        @if (imagen?.archivo) { <span>{{ imagen?.archivo }}</span> }
        @if (!imagen && form.value.imagenUrl) { <img [src]="form.value.imagenUrl" alt="" width="120" /> }
        <p-fileUpload mode="basic" chooseLabel="Subir imagen" accept="image/*"
                      [customUpload]="true" (uploadHandler)="uploadImagen($event)" [auto]="true" />
      </div>
      <div class="admin-form-actions">
        <button pButton type="button" label="Cancelar" class="p-button-text" routerLink="/admin/noticias"></button>
        <button pButton type="submit" label="Guardar" [loading]="saving"></button>
      </div>
    </form>
  `,
})
export class NoticiaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(NoticiaService);
  private adjuntos = inject(AdjuntoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(MessageService);

  id: number | null = null;
  saving = false;
  scraping = false;
  scrapeUrl = '';
  imagen: Adjunto | null = null;

  form = this.fb.nonNullable.group({
    titulo: ['', Validators.required],
    resumen: ['', Validators.required],
    fecha: this.fb.control<Date | null>(null, Validators.required),
    url: ['', Validators.required],
    imagenUrl: [''],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.service.findOne(this.id).subscribe((item) => {
        this.form.patchValue({
          titulo: item.titulo,
          resumen: item.resumen,
          fecha: new Date(item.fecha),
          url: item.url,
          imagenUrl: item.imagenUrl ?? '',
        });
        this.imagen = item.imagen;
      });
    }
  }

  scrape(): void {
    if (!this.scrapeUrl) return;
    this.scraping = true;
    this.service.scrape(this.scrapeUrl).subscribe({
      next: (result) => {
        this.scraping = false;
        if (!result.ok) {
          this.toast.add({ severity: 'error', summary: 'Error', detail: result.error ?? 'No se pudo leer la URL' });
          return;
        }
        this.form.patchValue({
          titulo: result.title,
          resumen: result.description,
          fecha: result.fecha ? parseLegacyDate(result.fecha) : null,
          url: this.scrapeUrl,
          imagenUrl: result.image,
        });
      },
      error: () => {
        this.scraping = false;
        this.toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo leer la URL' });
      },
    });
  }

  uploadImagen(event: FileUploadHandlerEvent): void {
    this.adjuntos.upload(event.files[0]).subscribe((adjunto) => (this.imagen = adjunto));
  }

  submit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const raw = this.form.getRawValue();
    const payload = {
      titulo: raw.titulo,
      resumen: raw.resumen,
      fecha: raw.fecha!.toISOString(),
      url: raw.url,
      imagenUrl: raw.imagenUrl || undefined,
      imagenId: this.imagen?.id,
    };
    const request$ = this.id ? this.service.update(this.id, payload) : this.service.create(payload);
    request$.subscribe({
      next: () => this.router.navigate(['/admin/noticias']),
      error: (err) => {
        this.saving = false;
        this.toast.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? 'No se pudo guardar' });
      },
    });
  }
}
