import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule, FileUploadHandlerEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { BibliografiaService } from '../../bibliografia.service';
import { AdjuntoService, Adjunto } from '../../../../core/adjunto/adjunto.service';

@Component({
  selector: 'app-bibliografia-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonModule, InputTextModule, TextareaModule, FileUploadModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast />
    <h2>{{ id ? 'Editar bibliografía' : 'Nueva bibliografía' }}</h2>
    <form [formGroup]="form" (ngSubmit)="submit()" class="admin-form">
      <div class="admin-field">
        <label for="titulo">Título *</label>
        <input pInputText id="titulo" formControlName="titulo" />
      </div>
      <div class="admin-field">
        <label for="autores">Autores *</label>
        <input pInputText id="autores" formControlName="autores" />
      </div>
      <div class="admin-field">
        <label for="isbn">ISBN</label>
        <input pInputText id="isbn" formControlName="isbn" />
      </div>
      <div class="admin-field">
        <label for="resumen">Resumen</label>
        <textarea pTextarea id="resumen" formControlName="resumen" rows="4"></textarea>
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
        @if (adjunto?.archivo) { <span>{{ adjunto?.archivo }}</span> }
        <p-fileUpload mode="basic" chooseLabel="Subir adjunto" accept="application/pdf,application/vnd.ms-word"
                      [customUpload]="true" (uploadHandler)="uploadAdjunto($event)" [auto]="true" />
      </div>
      <div class="admin-form-actions">
        <button pButton type="button" label="Cancelar" class="p-button-text" routerLink="/admin/bibliografia"></button>
        <button pButton type="submit" label="Guardar" [loading]="saving"></button>
      </div>
    </form>
  `,
})
export class BibliografiaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(BibliografiaService);
  private adjuntos = inject(AdjuntoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(MessageService);

  id: number | null = null;
  saving = false;
  adjunto: Adjunto | null = null;

  form = this.fb.nonNullable.group({
    titulo: ['', Validators.required],
    autores: ['', Validators.required],
    isbn: [''],
    resumen: [''],
    web: [''],
    palabrasClaves: [''],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.service.findOne(this.id).subscribe((item) => {
        this.form.patchValue({
          titulo: item.titulo,
          autores: item.autores,
          isbn: item.isbn ?? '',
          resumen: item.resumen ?? '',
          web: item.web ?? '',
          palabrasClaves: item.palabrasClaves ?? '',
        });
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
    const payload = { ...this.form.getRawValue(), adjuntoId: this.adjunto?.id };
    const request$ = this.id ? this.service.update(this.id, payload) : this.service.create(payload);
    request$.subscribe({
      next: () => this.router.navigate(['/admin/bibliografia']),
      error: (err) => {
        this.saving = false;
        this.toast.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? 'No se pudo guardar' });
      },
    });
  }
}
