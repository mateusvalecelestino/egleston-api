import { z } from 'zod';
const turmaBodySchema = z.object({
  id: z
    .number({
      required_error: 'O id do turno é obrigatório.',
      invalid_type_error: 'O id do turno deve ser número.',
    })
    .int({ message: 'O id do turno deve ser inteiro.' })
    .positive({ message: 'O id do turno deve ser positivo.' }),
  // TODO: Add appropriated nome regex
  nome: z
    .string({
      required_error: 'O nome do turno é obrigatório.',
      invalid_type_error: 'O nome do turno deve ser string.',
    })
    .trim()
    .min(1, {
      message: 'O nome do turno deve possuir no mínimo 1 caracteres.',
    })
    .max(30, {
      message: 'O nome do turno deve possuir no máximo 30 caracteres.',
    }),
  classeId: z
    .number({
      required_error: 'O id da classe é obrigatório.',
      invalid_type_error: 'O id da classe deve ser número.',
    })
    .int({ message: 'O id da classe deve ser inteiro.' })
    .positive({ message: 'O id da classe deve ser positivo.' }),
  salaId: z
    .number({
      required_error: 'O id da sala é obrigatório.',
      invalid_type_error: 'O id da sala deve ser número.',
    })
    .int({ message: 'O id da sala deve ser inteiro.' })
    .positive({ message: 'O id da sala deve ser positivo.' }),
});

const turmaParamsSchema = z.object({
  turmaId: z.coerce
    .number({
      required_error: 'O id da turma é obrigatório.',
      invalid_type_error: 'O id da turma deve ser número.',
    })
    .int({ message: 'O id da turma deve ser inteiro.' })
    .positive({ message: 'O id da turma deve ser positivo.' }),
});
