import { FastifyReply, FastifyRequest } from 'fastify';
import {
  anoLectivoParamsType,
  createAnoLectivoBodyType,
  createClasseToAnoLectivoBodyType,
  patchAnoLectivoBodyType,
} from '../schemas/anoLectivoSchema';
import {
  changeAnoLectivoActiveState,
  createAnoLectivo,
  getAnoLectivo,
  getAnoLectivoActivo,
  getAnoLectivoByNome,
  getAnoLectivoId,
  getAnoLectivos,
  updateAnoLectivo,
} from '../services/anoLectivoServices';
import {
  createClasse,
  getClasseByUniqueKey,
  getClassesByAnoLectivo,
} from '../services/classeServices';
import { getCursoId } from '../services/cursoServices';
import BadRequest from '../utils/BadRequest';
import {
  ANO_LECTIVO_MONTH_LENGTH,
  throwDuplicatedAnoLectivoError,
  throwInvalidAnoLectivoInicioError,
  throwInvalidAnoLectivoYearLengthError,
  throwNotFoundAnoLectivoIdError,
} from '../utils/controllers/anoLectivoControllerUtils';
import { throwDuplicatedClasseError } from '../utils/controllers/classeControllerUtils';
import { throwNotFoundCursoIdFieldError } from '../utils/controllers/cursoControllerUtils';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import {
  calculateTimeBetweenDates,
  formatDate,
  isBeginDateAfterEndDate,
} from '../utils/utilsFunctions';
import { getTrimestreByAnoLectivo } from '../services/trimestreServices';

export async function createAnoLectivoController(
  request: FastifyRequest<{ Body: createAnoLectivoBodyType }>,
  reply: FastifyReply
) {
  const { inicio: inicioString, termino: terminoString } = request.body;
  const inicio = new Date(inicioString);
  const termino = new Date(terminoString);

  // Validating dates
  if (isBeginDateAfterEndDate(inicio, termino))
    throwInvalidAnoLectivoInicioError();

  // FIXME: O dia de inicio do mês não começa em 01 caso for dado com 01.
  // e.g: 2024-09-01 -> 2024-08-31
  const yearMonthLength = calculateTimeBetweenDates(inicio, termino, 'M');
  if (yearMonthLength !== ANO_LECTIVO_MONTH_LENGTH)
    throwInvalidAnoLectivoYearLengthError();

  const nome = `${inicio.getFullYear()}-${termino.getFullYear()}`;
  const isAnoLectivoNome = await getAnoLectivoByNome(nome);

  if (isAnoLectivoNome) throwDuplicatedAnoLectivoError();

  const anoLectivo = await createAnoLectivo({ nome, inicio, termino });
  return reply.status(HttpStatusCodes.CREATED).send({
    id: anoLectivo.id,
    nome: anoLectivo.nome,
    inicio: formatDate(anoLectivo.inicio),
    termino: formatDate(anoLectivo.termino),
    activo: anoLectivo.activo,
  });
}

export async function updateAnoLectivoController(
  request: FastifyRequest<{
    Params: anoLectivoParamsType;
    Body: createAnoLectivoBodyType;
  }>,
  reply: FastifyReply
) {
  const { inicio: inicioString, termino: terminoString } = request.body;
  const { anoLectivoId } = request.params;
  const inicio = new Date(inicioString);
  const termino = new Date(terminoString);

  if (isBeginDateAfterEndDate(inicio, termino))
    throwInvalidAnoLectivoInicioError();

  const yearMonthLength = calculateTimeBetweenDates(inicio, termino, 'M');
  if (yearMonthLength !== ANO_LECTIVO_MONTH_LENGTH)
    throwInvalidAnoLectivoYearLengthError();

  const nome = `${inicio.getFullYear()}-${termino.getFullYear()}`;
  const [isAnoLectivo, anoLectivo] = await Promise.all([
    getAnoLectivoId(anoLectivoId),
    getAnoLectivoByNome(nome),
  ]);

  if (!isAnoLectivo) throwNotFoundAnoLectivoIdError();
  if (anoLectivo && anoLectivo.id !== anoLectivoId)
    throwDuplicatedAnoLectivoError();

  const anoLectivoUpdated = await updateAnoLectivo(anoLectivoId, {
    nome,
    inicio,
    termino,
  });

  return reply.send({
    id: anoLectivoUpdated.id,
    nome: anoLectivoUpdated.nome,
    inicio: formatDate(anoLectivoUpdated.inicio),
    termino: formatDate(anoLectivoUpdated.termino),
    activo: anoLectivoUpdated.activo,
  });
}

export async function getAnoLectivosController(
  _: FastifyRequest,
  reply: FastifyReply
) {
  return reply.send(await getAnoLectivos());
}

export async function getAnoLectivoController(
  request: FastifyRequest<{ Params: anoLectivoParamsType }>,
  reply: FastifyReply
) {
  const { anoLectivoId } = request.params;
  const anoLectivo = await getAnoLectivo(anoLectivoId);

  if (!anoLectivo) throwNotFoundAnoLectivoIdError();

  return reply.send({
    id: anoLectivo!.id,
    nome: anoLectivo!.nome,
    inicio: formatDate(anoLectivo!.inicio),
    termino: formatDate(anoLectivo!.termino),
    activo: anoLectivo!.activo,
  });
}

export async function getAnoLectivoClassesController(
  request: FastifyRequest<{ Params: anoLectivoParamsType }>,
  reply: FastifyReply
) {
  const { anoLectivoId } = request.params;
  const anoLectivo = await getAnoLectivoId(anoLectivoId);

  if (!anoLectivo) throwNotFoundAnoLectivoIdError();

  const classes = await getClassesByAnoLectivo(anoLectivoId);
  return reply.send(classes);
}

export async function createClasseToAnoLectivoController(
  request: FastifyRequest<{
    Params: anoLectivoParamsType;
    Body: createClasseToAnoLectivoBodyType;
  }>,
  reply: FastifyReply
) {
  const { anoLectivoId } = request.params;
  const { nome, cursoId, valorMatricula } = request.body;

  const [isAnoLectivo, isCursoId] = await Promise.all([
    getAnoLectivoId(anoLectivoId),
    getCursoId(cursoId),
  ]);

  if (!isAnoLectivo) throwNotFoundAnoLectivoIdError();
  if (!isCursoId) throwNotFoundCursoIdFieldError();

  const isClasse = await getClasseByUniqueKey(nome, anoLectivoId, cursoId);

  if (isClasse) throwDuplicatedClasseError();

  // TODO: REFACTOR THIS
  const classe = await createClasse({
    nome,
    anoLectivoId,
    cursoId,
    valorMatricula: Number(valorMatricula.toFixed(2)),
  });

  // TODO: Send a appropriate response
  return reply.status(HttpStatusCodes.CREATED).send(classe);
}

export async function patchAnoLectivoController(
  request: FastifyRequest<{
    Params: anoLectivoParamsType;
    Body: patchAnoLectivoBodyType;
  }>,
  reply: FastifyReply
) {
  const { anoLectivoId } = request.params;
  const { activo } = request.body;

  const [isAnoLectivoId, activeAnoLectivo] = await Promise.all([
    getAnoLectivoId(anoLectivoId),
    getAnoLectivoActivo(activo),
  ]);

  if (!isAnoLectivoId) throwNotFoundAnoLectivoIdError();

  if (activo && activeAnoLectivo && activeAnoLectivo?.id !== anoLectivoId) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Ano lectivo inválido',
      errors: { activo: ['Apenas um ano lectivo pode estar activo por vez.'] },
    });
  }

  const anoLectivo = await changeAnoLectivoActiveState(anoLectivoId, activo);
  return reply.send(anoLectivo);
}

export async function getAnoLectivoTrimestresController(
  request: FastifyRequest<{ Params: anoLectivoParamsType }>,
  reply: FastifyReply
) {
  const { anoLectivoId } = request.params;
  const anoLectivo = await getAnoLectivoId(anoLectivoId);

  if (!anoLectivo) throwNotFoundAnoLectivoIdError();

  return reply.send(await getTrimestreByAnoLectivo(anoLectivoId));
}
