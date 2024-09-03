import { z } from 'zod';
import { fullNameRegEx } from '../utils/regexPatterns';
import { contactoSchema } from './contactoSchema';
import {
  complexBadRequestSchema,
  getResourcesDefaultQueriesSchema,
  simpleBadRequestSchema,
} from './globalSchema';

const professorBodySchema = z.object({
  id: z
    .number({
      required_error: 'O id do professor é obrigatório.',
      invalid_type_error: 'O id do professor deve ser número.',
    })
    .int({ message: 'O id do professor deve ser inteiro.' })
    .positive({ message: 'O id do professor deve ser positivo.' }),
  nomeCompleto: z
    .string({
      required_error: 'O nome completo é obrigatório.',
      invalid_type_error: 'O nome completo deve ser uma string.',
    })
    .trim()
    .min(10, {
      message: 'O nome completo deve possuir no mínimo 10 caracteres.',
    })
    .max(100, {
      message: 'O nome completo deve possuir no máximo 100 caracteres.',
    })
    .regex(fullNameRegEx, {
      message:
        'O nome completo deve possuir apenas caracteres alfabéticos e espaços.',
    }),
  dataNascimento: z
    .string({ required_error: 'A data de nascimento é obrigatória.' })
    .trim()
    .date(
      'A data de nascimento deve ser uma data válida no formato AAAA-MM-DD.'
    )
    .transform((date) => new Date(date)),
});

const professorParamsSchema = z.object({
  professorId: z.coerce
    .number({
      required_error: 'O id do professor é obrigatório.',
      invalid_type_error: 'O id do professor deve ser número.',
    })
    .int({ message: 'O id do professor deve ser inteiro.' })
    .positive({ message: 'O id do professor deve ser positivo.' }),
});

export const createProfessorSchema = {
  summary: 'Adiciona um novo professor',
  tags: ['professores'],
  body: professorBodySchema.omit({ id: true }).extend({
    contacto: contactoSchema,
    disciplinas: z
      .array(
        z
          .number({
            message: 'O array de disciplinas deve conter apenas números.',
          })
          .int({
            message:
              'O array de disciplinas deve conter apenas números inteiros.',
          })
          .positive({
            message:
              'O array de disciplinas deve conter apenas números inteiros positivos.',
          }),
        {
          invalid_type_error:
            'As disciplinas devem ser  enviadas no formato de array.',
        }
      )
      .optional(),
  }),
  response: {
    201: professorBodySchema.extend({
      dataNascimento: z.string().date(),
      contacto: contactoSchema,
    }),
    400: simpleBadRequestSchema,
  },
};

export const updateProfessorSchema = {
  summary: 'Atualiza um professor existente',
  tags: ['professores'],
  params: professorParamsSchema,
  body: professorBodySchema
    .omit({ id: true })
    .extend({ contacto: contactoSchema }),
  response: {
    200: professorBodySchema.extend({
      dataNascimento: z.string().date(),
      contacto: contactoSchema,
    }),
    400: simpleBadRequestSchema,
    404: simpleBadRequestSchema,
  },
};

export const getProfessorSchema = {
  summary: 'Retorna um professor',
  tags: ['professores'],
  params: professorParamsSchema,
  response: {
    200: professorBodySchema.extend({
      dataNascimento: z.string().date(),
      contacto: contactoSchema,
    }),
    404: simpleBadRequestSchema,
  },
};

export const getProfessoresSchema = {
  summary: 'Retorna todos os professores',
  tags: ['professores'],
  querystring: getResourcesDefaultQueriesSchema,
  response: {
    200: z.object({
      data: z.array(
        professorBodySchema.extend({
          dataNascimento: z.string().date(),
        })
      ),
      next_cursor: z.number().optional(),
    }),
  },
};

const professorDisciplinaSchema = {
  tags: ['professores'],
  params: professorParamsSchema,
  body: z.object({
    disciplinas: z
      .array(
        z
          .number({
            message: 'O array de disciplinas deve conter apenas números.',
          })
          .int({
            message:
              'O array de disciplinas deve conter apenas números inteiros.',
          })
          .positive({
            message:
              'O array de disciplinas deve conter apenas números inteiros positivos.',
          }),
        {
          invalid_type_error:
            'As disciplinas devem ser  enviadas no formato de array.',
        }
      )
      .nonempty({ message: 'O array de disciplinas não deve estar vazio.' }),
  }),
  response: {
    // TODO: MAKE THIS DYNAMIC
    // 200: professorBodySchema.extend({
    //   dataNascimento: z.string().date(),
    //   disciplinas: z.number().int().positive(),
    // }),
    400: complexBadRequestSchema,
    404: complexBadRequestSchema,
  },
};

export const createMultiplesProfessorDisciplinaSchema = {
  summary: 'Associa Múltiplas disciplinas à um professor',
  ...professorDisciplinaSchema,
};

export const deleteProfessorDisciplinaSchema = {
  summary: 'Remove associação entre professor e disciplina',
  tags: ['professores'],
  params: professorParamsSchema.extend({
    disciplinaId: z.coerce
      .number({
        required_error: 'O id de disciplina é obrigatório.',
        invalid_type_error: 'O id de disciplina deve ser número.',
      })
      .int({ message: 'O id de disciplina deve ser inteiro.' })
      .positive({ message: 'O id de disciplina deve ser positivo.' }),
  }),
  response: {
    404: simpleBadRequestSchema,
  },
};

export const deleteMultiplesProfessorDisciplinaSchema = {
  summary: 'Deleta múltiplas disciplinas associadas à um professor',
  ...professorDisciplinaSchema,
};

export type professorParamsSchema = z.infer<typeof professorParamsSchema>;
export type createProfessorBodyType = z.infer<
  typeof createProfessorSchema.body
>;

export type updateProfessorBodyType = z.infer<
  typeof updateProfessorSchema.body
>;

export type getProfessoresQueryStringType = z.infer<
  typeof getProfessoresSchema.querystring
>;

export type professorDisciplinaBodyType = z.infer<
  typeof createMultiplesProfessorDisciplinaSchema.body
>;

export type deleteProfessorDisciplinaParamsType = z.infer<
  typeof deleteProfessorDisciplinaSchema.params
>;
