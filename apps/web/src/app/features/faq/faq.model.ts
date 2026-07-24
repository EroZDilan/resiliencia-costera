export interface Faq {
  id: number;
  pregunta: string;
  respuesta: string;
}

export type CreateFaqPayload = Omit<Faq, 'id'>;
