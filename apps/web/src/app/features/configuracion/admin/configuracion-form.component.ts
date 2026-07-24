import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule, FileUploadHandlerEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfiguracionService } from '../configuracion.service';
import { AdjuntoService, Adjunto } from '../../../core/adjunto/adjunto.service';

@Component({
  selector: 'app-configuracion-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, FileUploadModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast />
    <h2>Configuración del sitio</h2>
    <form [formGroup]="form" (ngSubmit)="submit()" class="admin-form">
      <div class="admin-field">
        <label for="nombre">Nombre *</label>
        <input pInputText id="nombre" formControlName="nombre" />
      </div>
      <div class="admin-field">
        <label for="concepto">Concepto *</label>
        <textarea pTextarea id="concepto" formControlName="concepto" rows="3"></textarea>
      </div>
      <div class="admin-field">
        <label for="objetivo">Objetivo *</label>
        <textarea pTextarea id="objetivo" formControlName="objetivo" rows="3"></textarea>
      </div>
      <div class="admin-field">
        <label for="respuestaAutomatica">Respuesta automática (contáctenos) *</label>
        <textarea pTextarea id="respuestaAutomatica" formControlName="respuestaAutomatica" rows="3"></textarea>
      </div>
      <div class="admin-field">
        <label for="emailEmisor">Email emisor *</label>
        <input pInputText id="emailEmisor" formControlName="emailEmisor" />
      </div>
      <div class="admin-field">
        <label>Logo *</label>
        @if (adjuntos.url(logo); as url) { <img [src]="url" width="80" alt="" /> }
        <p-fileUpload mode="basic" chooseLabel="Subir logo" accept="image/*"
                      [customUpload]="true" (uploadHandler)="uploadLogo($event)" [auto]="true" />
      </div>
      <div class="admin-field">
        <label>Logo sin texto</label>
        @if (adjuntos.url(logoTextless); as url) { <img [src]="url" width="80" alt="" /> }
        <p-fileUpload mode="basic" chooseLabel="Subir logo sin texto" accept="image/*"
                      [customUpload]="true" (uploadHandler)="uploadLogoTextless($event)" [auto]="true" />
      </div>
      <div class="admin-field">
        <label for="textoProyectos">Texto de proyectos *</label>
        <textarea pTextarea id="textoProyectos" formControlName="textoProyectos" rows="3"></textarea>
      </div>
      <div class="admin-field">
        <label for="textoIniciativas">Texto de iniciativas *</label>
        <textarea pTextarea id="textoIniciativas" formControlName="textoIniciativas" rows="3"></textarea>
      </div>
      <div class="admin-field">
        <label for="telefono">Teléfono</label>
        <input pInputText id="telefono" formControlName="telefono" />
      </div>
      <div class="admin-field">
        <label for="facebook">Facebook</label>
        <input pInputText id="facebook" formControlName="facebook" />
      </div>
      <div class="admin-field">
        <label for="twitter">Twitter</label>
        <input pInputText id="twitter" formControlName="twitter" />
      </div>
      <div class="admin-field">
        <label for="instagram">Instagram</label>
        <input pInputText id="instagram" formControlName="instagram" />
      </div>
      <div class="admin-form-actions">
        <button pButton type="submit" label="Guardar" [loading]="saving"></button>
      </div>
    </form>
  `,
})
export class ConfiguracionFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(ConfiguracionService);
  private toast = inject(MessageService);
  adjuntos = inject(AdjuntoService);

  saving = false;
  logo: Adjunto | null = null;
  logoTextless: Adjunto | null = null;

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    concepto: ['', Validators.required],
    objetivo: ['', Validators.required],
    respuestaAutomatica: ['', Validators.required],
    emailEmisor: ['', Validators.required],
    textoProyectos: ['', Validators.required],
    textoIniciativas: ['', Validators.required],
    telefono: [''],
    facebook: [''],
    twitter: [''],
    instagram: [''],
  });

  ngOnInit(): void {
    this.service.get().subscribe((config) => {
      this.form.patchValue({
        ...config,
        telefono: config.telefono ?? '',
        facebook: config.facebook ?? '',
        twitter: config.twitter ?? '',
        instagram: config.instagram ?? '',
      });
      this.logo = config.logo;
      this.logoTextless = config.logoTextless;
    });
  }

  uploadLogo(event: FileUploadHandlerEvent): void {
    this.adjuntos.upload(event.files[0]).subscribe((adjunto) => (this.logo = adjunto));
  }

  uploadLogoTextless(event: FileUploadHandlerEvent): void {
    this.adjuntos.upload(event.files[0]).subscribe((adjunto) => (this.logoTextless = adjunto));
  }

  submit(): void {
    if (this.form.invalid || !this.logo) return;
    this.saving = true;
    const payload = {
      ...this.form.getRawValue(),
      logoId: this.logo.id,
      logoTextlessId: this.logoTextless?.id,
    };
    this.service.update(payload).subscribe({
      next: () => {
        this.saving = false;
        this.toast.add({ severity: 'success', summary: 'Guardado' });
      },
      error: (err) => {
        this.saving = false;
        this.toast.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? 'No se pudo guardar' });
      },
    });
  }
}
