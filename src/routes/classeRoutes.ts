import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createClasseController,
  createTurmaInClasseController,
  getClasseAlunosController,
  getClasseController,
  getClasseTurmasController,
  updateClasseController,
} from '../controllers/classeController';
import {
  createClasseSchema,
  createTurmaToClasseSchema,
  getClasseAlunosSchema,
  getClasseSchema,
  getClasseTurmasSchema,
  updateClasseSchema,
} from '../schemas/classeSchemas';

export const classeRoutes: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // POST
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: createClasseSchema,
    handler: createClasseController,
  });

  // PUT
  server.withTypeProvider<ZodTypeProvider>().put('/:classeId', {
    schema: updateClasseSchema,
    handler: updateClasseController,
  });

  // GET UNIQUE
  server.withTypeProvider<ZodTypeProvider>().get('/:classeId', {
    schema: getClasseSchema,
    handler: getClasseController,
  });

  // GET Turmas
  server.withTypeProvider<ZodTypeProvider>().get('/:classeId/turmas', {
    schema: getClasseTurmasSchema,
    handler: getClasseTurmasController,
  });

  // GET Classe Aluno
  server.withTypeProvider<ZodTypeProvider>().get('/:classeId/alunos', {
    schema: getClasseAlunosSchema,
    handler: getClasseAlunosController,
  });

  // POST Turma
  server.withTypeProvider<ZodTypeProvider>().post('/:classeId/turmas', {
    schema: createTurmaToClasseSchema,
    handler: createTurmaInClasseController,
  });
};
