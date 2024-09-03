import BadRequest from '../BadRequest';
import HttpStatusCodes from '../HttpStatusCodes';

export function throwNotFoundClasseIdError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Classe não existe.',
  });
}

export function throwDuplicatedClasseError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: 'Classe já existe.',
  });
}

export function throwNotFoundClasseIdFieldError() {
  throw new BadRequest({
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: 'Classe inválida.',
    errors: {
      classeId: ['Classe não existe.'],
    },
  });
}
