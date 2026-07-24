import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { FileUploadModule, FileUploadHandlerEvent } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProyectoService } from '../../proyecto.service';
import { OrganizacionService } from '../../../organizacion/organizacion.service';
import { Organizacion } from '../../../organizacion/organizacion.model';
import { EstadoProyecto, ProyectoLugar } from '../../proyecto.model';
import { AdjuntoService, Adjunto } from '../../../../core/adjunto/adjunto.service';
import { toWktPoint } from '../../../../shared/geo/wkt-point';

const ESTADOS = [
  { label: 'En curso', value: 'EN_CURSO' },
  { label: 'Terminado', value: 'TERMINADO' },
];

@Component({
  selector: 'app-proyecto-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    MultiSelectModule,
    DatePickerModule,
    FileUploadModule,
    TableModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './proyecto-form.component.html',
  styleUrl: './proyecto-form.component.scss',
})
export class ProyectoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(ProyectoService);
  private organizacionService = inject(OrganizacionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(MessageService);
  adjuntos = inject(AdjuntoService);

  id: number | null = null;
  logo: Adjunto | null = null;
  organizaciones: Organizacion[] = [];
  lugares: ProyectoLugar[] = [];
  saving = false;
  estados = ESTADOS;

  form = this.fb.nonNullable.group({
    nombreCorto: ['', Validators.required],
    nombreOficial: ['', Validators.required],
    areaIntervencion: [''],
    web: ['', Validators.required],
    estado: this.fb.nonNullable.control<EstadoProyecto>('EN_CURSO', Validators.required),
    fechaInicio: this.fb.control<Date | null>(null, Validators.required),
    email: [''],
    telefono: [''],
    facebook: [''],
    instagram: [''],
    twitter: [''],
    resultado: [''],
    otrosLideres: [''],
    otrosParticipantes: [''],
    organizacionesLideresIds: this.fb.nonNullable.control<number[]>([]),
    organizacionesParticipantesIds: this.fb.nonNullable.control<number[]>([]),
  });

  lugarForm = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    lat: this.fb.control<number | null>(null, Validators.required),
    lng: this.fb.control<number | null>(null, Validators.required),
  });

  get logoUrl(): string | null {
    return this.adjuntos.url(this.logo);
  }

  ngOnInit(): void {
    this.organizacionService.findAll().subscribe((data) => (this.organizaciones = data));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.service.findOne(this.id).subscribe((proyecto) => {
        this.form.patchValue({
          nombreCorto: proyecto.nombreCorto,
          nombreOficial: proyecto.nombreOficial,
          areaIntervencion: proyecto.areaIntervencion ?? '',
          web: proyecto.web,
          estado: proyecto.estado,
          fechaInicio: proyecto.fechaInicio ? new Date(proyecto.fechaInicio) : null,
          email: proyecto.email ?? '',
          telefono: proyecto.telefono ?? '',
          facebook: proyecto.facebook ?? '',
          instagram: proyecto.instagram ?? '',
          twitter: proyecto.twitter ?? '',
          resultado: proyecto.resultado ?? '',
          otrosLideres: proyecto.otrosLideres ?? '',
          otrosParticipantes: proyecto.otrosParticipantes ?? '',
          organizacionesLideresIds: proyecto.organizacionesLideres.map((o) => o.id),
          organizacionesParticipantesIds: proyecto.organizacionesParticipantes.map((o) => o.id),
        });
        this.logo = proyecto.logo;
        this.lugares = proyecto.lugares;
      });
    }
  }

  uploadLogo(event: FileUploadHandlerEvent): void {
    const file = event.files[0];
    this.adjuntos.upload(file).subscribe((adjunto) => (this.logo = adjunto));
  }

  submit(): void {
    if (this.form.invalid || !this.logo) {
      this.toast.add({
        severity: 'warn',
        summary: 'Faltan datos',
        detail: !this.logo ? 'Debe indicar un logo para el proyecto.' : 'Complete los campos requeridos.',
      });
      return;
    }
    const raw = this.form.getRawValue();
    if (!raw.email && !raw.telefono) {
      this.toast.add({ severity: 'warn', summary: 'Falta contacto', detail: 'Debe indicar un email o un teléfono.' });
      return;
    }

    this.saving = true;
    const payload = {
      ...raw,
      fechaInicio: raw.fechaInicio!.toISOString(),
      logoId: this.logo.id,
    };
    const request$ = this.id ? this.service.update(this.id, payload) : this.service.create(payload);

    request$.subscribe({
      next: (proyecto) => {
        this.saving = false;
        if (!this.id) {
          // Mirrors ProyectoController::createRedirectOnSuccess(): after
          // creating, go straight to managing this project's lugares.
          this.router.navigate(['/admin/proyectos', proyecto.id]);
        } else {
          this.toast.add({ severity: 'success', summary: 'Guardado', detail: proyecto.nombreCorto });
        }
      },
      error: (err) => {
        this.saving = false;
        this.toast.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? 'No se pudo guardar' });
      },
    });
  }

  addLugar(): void {
    if (this.lugarForm.invalid || !this.id) return;
    const { nombre, lat, lng } = this.lugarForm.getRawValue();
    this.service.createLugar(this.id, { nombre, geometria: toWktPoint(lat!, lng!) }).subscribe((lugar) => {
      this.lugares = [...this.lugares, lugar];
      this.lugarForm.reset();
    });
  }

  removeLugar(lugar: ProyectoLugar): void {
    if (!this.id) return;
    this.service.removeLugar(this.id, lugar.id).subscribe(() => {
      this.lugares = this.lugares.filter((l) => l.id !== lugar.id);
    });
  }
}
