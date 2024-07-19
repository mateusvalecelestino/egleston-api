import { z } from 'zod';
import { simpleBadRequestSchema } from './globalSchema';
const anoLectivoBodySchema = z.object({
  id: z
    .number({
      required_error: 'O id do ano lectivo é obrigatório.',
      invalid_type_error: 'O id do ano lectivo deve ser número.',
    })
    .int({ message: 'O id do ano lectivo deve ser inteiro.' })
    .positive({ message: 'O id do ano lectivo deve ser positivo.' }),
  // TODO: Add a regex validation for nome
  nome: z
    .string({
      required_error: 'O nome do ano lectivo é obrigatório.',
      invalid_type_error: 'O id do ano lectivo deve ser número.',
    })
    .trim()
    .min(4, {
      message: 'O nome do ano lectivo deve possuir no mínimo 4 caracteres.',
    })
    .max(10, {
      message: 'O nome do ano lectivo deve possuir no máximo 10 caracteres.',
    }),
  inicio: z
    .string({
      required_error: 'O inicio do ano lectivo é obrigatório.',
      invalid_type_error: 'O inicio do ano lectivo é obrigatório.',
    })
    .trim()
    .date('O inicio deve ser uma data válida.'),
  termino: z
    .string({
      required_error: 'O termino do ano lectivo é obrigatório.',
      invalid_type_error: 'O termino do ano lectivo é obrigatório.',
    })
    .trim()
    .date('O termino deve ser uma data válida.'),
});

const anoLectivoParamsSchema = z.object({
  anoLectivoId: z.coerce
    .number({
      required_error: 'O id do ano lectivo é obrigatório.',
      invalid_type_error: 'O id do ano lectivo deve ser número.',
    })
    .int({ message: 'O id do ano lectivo deve ser inteiro.' })
    .positive({ message: 'O id do ano lectivo deve ser positivo.' }),
});

export const postAnoLectivoSchema = {
  summary: 'Adiciona um ano lectivo ',
  tags: ['ano-lectivo'],
  body: anoLectivoBodySchema.omit({ id: true }),
  response: {
    201: anoLectivoBodySchema,
    400: simpleBadRequestSchema,
  },
};

export const putAnoLectivoSchema = {
  summary: 'Atualiza um ano lectivo existente',
  tags: ['ano-lectivo'],
  params: anoLectivoParamsSchema,
  body: anoLectivoBodySchema.omit({ id: true }),
  response: {
    200: anoLectivoBodySchema.omit({ id: true }),
    400: simpleBadRequestSchema,
  },
};

export const getAnoLectivosSchema = {
  summary: 'Retorna todos os anos lectivos',
  tags: ['ano-lectivo'],
  response: {
    200: z.object({
      data: z.array(anoLectivoBodySchema.omit({ inicio: true, termino: true })),
    }),
  },
};

export type postAnoLectivoBodyType = z.infer<typeof postAnoLectivoSchema.body>;
export type anoLectivoParamsType = z.infer<typeof anoLectivoParamsSchema>;
