import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import alunosRoutes from './alunoRoutes';
import cursosRoutes from './cursoRoutes';
import disciplinaRoutes from './disciplinaRoutes';
import parentescosRoutes from './parentescoRoutes';
import professoresRoutes from './professorRoutes';
import responsaveisRoutes from './responsavelRoutes';
import { anoLectivoRoutes } from './anoLectivoRoutes';
import { classeRoutes } from './classeRoutes';
import { salaRoutes } from './salaRoutes';
import { turnoRoutes } from './turnoRoutes';
import { turmaRoutes } from './turmaRoutes';

// Create a plugin with all the routes as plugins
// Remember FastifyPlugin equals JS object
const routes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // Define all the prefix routes
  server.register(alunosRoutes, { prefix: '/api/alunos' });
  server.register(parentescosRoutes, { prefix: '/api/parentescos' });
  server.register(responsaveisRoutes, { prefix: '/api/responsaveis' });
  server.register(professoresRoutes, { prefix: '/api/professores' });
  server.register(cursosRoutes, { prefix: '/api/cursos' });
  server.register(disciplinaRoutes, { prefix: '/api/disciplinas' });
  server.register(anoLectivoRoutes, { prefix: '/api/ano-lectivos' });
  server.register(classeRoutes, { prefix: '/api/classes' });
  server.register(salaRoutes, { prefix: '/api/salas' });
  server.register(turnoRoutes, { prefix: '/api/turnos' });
  server.register(turmaRoutes, { prefix: '/api/turmas' });
};
export default routes; // Export the all routes
