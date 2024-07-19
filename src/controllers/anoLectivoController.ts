import dayjs from 'dayjs';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  anoLectivoParamsType,
  postAnoLectivoBodyType,
} from '../schemas/anoLectivoSchema';
import {
  getAnoLectivoInicioTermino,
  getAnoLectivoNome,
  saveAnoLectivo,
} from '../services/anoLectivoServices';
import BadRequest from '../utils/BadRequest';
import HttpStatusCodes from '../utils/HttpStatusCodes';
import { formatDate } from '../utils/utils';

// Validate the beginning and the end of ano lectivo
function checkBeginAndEndDates(inicio: string, termino: string) {
  const begin = dayjs(inicio);
  const end = dayjs(termino);

  if (begin.isAfter(end)) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'inicio inválido.',
      errors: { inicio: ['Inicio não pôde ser depois do termino.'] },
    });
  }

  const monthsBetweenYears = end.diff(begin, 'M');

  if (monthsBetweenYears < 6) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Ano lectivo inválido',
      errors: { termino: ['Término muito aproximado.'] },
    });
  }

  if (monthsBetweenYears > 11) {
    throw new BadRequest({
      statusCode: HttpStatusCodes.BAD_REQUEST,
      message: 'Ano lectivo inválido',
      errors: { termino: ['Término muito distante.'] },
    });
  }

  return { begin: begin.toDate(), end: end.toDate() };
}

function throwNomeBadRequest() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Nome do ano lectivo inválido.',
    errors: { nome: ['O nome do ano lectivo já existe.'] },
  });
}

function throwDuplicateAnoLectivoDurationBadRequest() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Ano lectivo inválido',
    errors: { nome: ['Ano lectivo já existe.'] },
  });
}

export async function createAnoLectivo(
  request: FastifyRequest<{ Body: postAnoLectivoBodyType }>,
  reply: FastifyReply
) {
  const { nome, inicio, termino } = request.body;
  const { begin, end } = checkBeginAndEndDates(inicio, termino);

  const [isAnoLectivoNome, isAnoLectivoInicioAndTermino] = await Promise.all([
    await getAnoLectivoNome(nome),
    await getAnoLectivoInicioTermino(begin, end),
  ]);

  if (isAnoLectivoNome) throwNomeBadRequest();

  if (isAnoLectivoInicioAndTermino) {
    throwDuplicateAnoLectivoDurationBadRequest();
  }

  const anoLectivo = await saveAnoLectivo({
    nome,
    inicio: begin,
    termino: end,
  });

  return reply.status(HttpStatusCodes.CREATED).send({
    id: anoLectivo.id,
    nome: anoLectivo.nome,
    inicio: formatDate(anoLectivo.inicio),
    termino: formatDate(anoLectivo.termino),
  });
}
