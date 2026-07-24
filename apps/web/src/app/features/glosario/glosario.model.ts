export interface Glosario {
  id: number;
  termino: string;
  significado: string;
}

export type CreateGlosarioPayload = Omit<Glosario, 'id'>;

export type GlosarioGrouped = Record<string, Glosario[]>;
