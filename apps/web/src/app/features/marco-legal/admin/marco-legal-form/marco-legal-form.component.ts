import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { FileUploadModule, FileUploadHandlerEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MarcoLegalService } from '../../marco-legal.service';
import { TIPO_MARCO_LEGAL_OPTIONS, TipoMarcoLegal } from '../../marco-legal.model';
import { AdjuntoService, Adjunto } from '../../../../core/adjunto/adjunto.service';

@Component({
  selector: 'app-marco-legal-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    FileUploadModule,
    ToastModule,
  ],
  providers: [MessageService],
  template: `
    <p-toast />
    <h2>{{ id ? 'Editar marco legal' : 'Nuevo marco legal' }}</h2>
    <form [formGroup]="form" (ngSubmit)="submit()" class="admin-form">
      <div class="admin-field">
        <label for="titulo">Título *</label>
        <input pInputText id="titulo" formControlName="titulo" />
      </div>
      <div class="admin-field">
        <label for="tipo">Tipo *</label>
        <p-select id="tipo" formControlName="tipo" [options]="tipos" optionLabel="label" optionValue="value" />
      </div>
      <div class="admin-field">
        <label for="emisor">Emisor *</label>
        <input pInputText id="emisor" formControlName="emisor" />
      </div>
      <div class="admin-field">
        <label for="anno">Año *</label>
        <p-inputNumber inputId="anno" formControlName="anno" [useGrouping]="false" />
      </div>
      <div class="admin-field">
        <label for="numero">Número *</label>
        <p-inputNumber inputId="numero" formControlName="numero" [useGrouping]="false" />
      </div>
      <div class="admin-field">
        <label for="web">Sitio web</label>
        <input pInputText id="web" formControlName="web" />
      </div>
      <div class="admin-field">
        <label for="palabrasClaves">Palabras clave</label>
        <input pInputText id="palabrasClaves" formControlName="palabrasClaves" />
      </div>
      <div class="admin-field">
        <label>Adjunto (PDF/Word)</label>
        @if (adjuntoNombre) { <span>{{ adjuntoNombre }}</span> }
        <p-fileUpload mode="basic" chooseLabel="Subir adjunto" accept="application/pdf,application/vnd.ms-word"
                      [customUpload]="true" (uploadHandler)="uploadAdjunto($event)" [auto]="true" />
      </div>
      <div class="admin-form-actions">
        <button pButton type="button" label="Cancelar" class="p-button-text" routerLink="/admin/marco-legal"></button>
        <button pButton type="submit" label="Guardar" [loading]="saving"></button>
      </div>
    </form>
  `,
})
export class MarcoLegalFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(MarcoLegalService);
  private adjuntos = inject(AdjuntoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(MessageService);

  id: number | null = null;
  saving = false;
  tipos = TIPO_MARCO_LEGAL_OPTIONS;
  adjunto: Adjunto | null = null;

  form = this.fb.nonNullable.group({
    titulo: ['', Validators.required],
    tipo: this.fb.nonNullable.control<TipoMarcoLegal>('LEY', Validators.required),
    emisor: ['', Validators.required],
    anno: this.fb.control<number | null>(null, Validators.required),
    numero: this.fb.control<number | null>(null, Validators.required),
    web: [''],
    palabrasClaves: [''],
  });

  get adjuntoNombre(): string | null {
    return this.adjunto?.archivo ?? null;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.service.findOne(this.id).subscribe((item) => {
        this.form.patchValue({ ...item, web: item.web ?? '', palabrasClaves: item.palabrasClaves ?? '' });
        this.adjunto = item.adjunto;
      });
    }
  }

  uploadAdjunto(event: FileUploadHandlerEvent): void {
    this.adjuntos.upload(event.files[0]).subscribe((adjunto) => (this.adjunto = adjunto));
  }

  submit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const raw = this.form.getRawValue();
    const payload = { ...raw, anno: raw.anno!, numero: raw.numero!, adjuntoId: this.adjunto?.id };
    const request$ = this.id ? this.service.update(this.id, payload) : this.service.create(payload);
    request$.subscribe({
      next: () => this.router.navigate(['/admin/marco-legal']),
      error: (err) => {
        this.saving = false;
        this.toast.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? 'No se pudo guardar' });
      },
    });
  }
}
