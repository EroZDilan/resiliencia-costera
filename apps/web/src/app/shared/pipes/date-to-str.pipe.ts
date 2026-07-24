import { Pipe, PipeTransform } from '@angular/core';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

// Mirrors crudEntity::dateToStr(): "7 de Marzo de 2024".
@Pipe({ name: 'dateToStr', standalone: true })
export class DateToStrPipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) return '';
    const date = new Date(value);
    return `${date.getDate()} de ${MESES[date.getMonth()]} de ${date.getFullYear()}`;
  }
}
