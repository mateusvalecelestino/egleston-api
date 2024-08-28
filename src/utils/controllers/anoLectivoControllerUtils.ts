import BadRequest from '../BadRequest';
import HttpStatusCodes from '../HttpStatusCodes';
import NotFoundRequest from '../NotFoundRequest';

export const ANO_LECTIVO_MONTH_LENGTH = 11;

export function throwInvalidAnoLectivoInicioError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Data de início inválida.',
    errors: { inicio: ['Início não pode ser após o término.'] },
  });
}

export function throwInvalidAnoLectivoYearLengthError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Ano lectivo inválido',
    errors: { termino: ['A duração do ano lectivo deve ser de 11 meses.'] },
  });
}

export function throwDuplicatedAnoLectivoError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'O ano lectivo já existe.',
  });
}

export function throwNotFoundAnoLectivoIdError() {
  throw new NotFoundRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'ID do ano lectivo não existe.',
  });
}

export function throwNotFoundAnoLectivoIdFieldError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Ano lectivo inválido',
    errors: { anoLectivoId: ['ID do ano lectivo não existe.'] },
  });
}
