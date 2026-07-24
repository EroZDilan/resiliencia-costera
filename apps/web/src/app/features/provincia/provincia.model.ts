export interface Provincia {
  id: number;
  nombre: string;
  dpa: number;
}

export type CreateProvinciaPayload = Omit<Provincia, 'id'>;
