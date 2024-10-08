import { prisma } from '../lib/prisma';

export async function getCursoDisciplina(
  cursoId: number,
  disciplinaId: number
) {
  return await prisma.cursosDisciplinas.findUnique({
    where: { cursoId_disciplinaId: { cursoId, disciplinaId } },
  });
}

export async function createMultiplesCursoDisciplinaByCurso(
  cursoId: number,
  disciplinas: Array<number>
) {
  await prisma.cursosDisciplinas.createMany({
    data: disciplinas.map((disciplinaId) => {
      return {
        cursoId,
        disciplinaId,
      };
    }),
  });

  const cursoDisciplina = await prisma.curso.findUnique({
    where: { id: cursoId },
    include: {
      CursosDisciplinas: {
        select: { disciplinaId: true },
      },
    },
  });

  return {
    id: cursoDisciplina?.id,
    nome: cursoDisciplina?.nome,
    descricao: cursoDisciplina?.descricao,
    duracao: cursoDisciplina?.duracao,
    disciplinas: cursoDisciplina?.CursosDisciplinas?.map((disciplina) => {
      return disciplina.disciplinaId;
    }),
  };
}

export async function createMultiplesCursoDisciplinaByDisciplina(
  disciplinaId: number,
  cursos: Array<number>
) {
  return await prisma.cursosDisciplinas.createMany({
    data: cursos.map((cursoId) => {
      return {
        disciplinaId,
        cursoId,
      };
    }),
  });
}

export async function deleteCursoDisciplina(
  cursoId: number,
  disciplinaId: number
) {
  return await prisma.cursosDisciplinas.delete({
    where: { cursoId_disciplinaId: { cursoId, disciplinaId } },
  });
}

export async function deleteMultiplesCursoDisciplinasByCursoId(
  cursoId: number,
  disciplinas: Array<number>
) {
  for (const disciplinaId of disciplinas) {
    await prisma.cursosDisciplinas.delete({
      where: { cursoId_disciplinaId: { cursoId, disciplinaId } },
    });
  }

  // FIXME: SOLVE THIS GAMBIARRA
  const cursoDisciplina = await prisma.curso.findUnique({
    where: { id: cursoId },
    include: {
      CursosDisciplinas: {
        select: { disciplinaId: true },
      },
    },
  });

  return {
    id: cursoDisciplina?.id,
    nome: cursoDisciplina?.nome,
    descricao: cursoDisciplina?.descricao,
    duracao: cursoDisciplina?.duracao,
    disciplinas: cursoDisciplina?.CursosDisciplinas?.map(
      ({ disciplinaId }) => disciplinaId
    ),
  };
}
