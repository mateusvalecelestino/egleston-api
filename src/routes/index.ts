import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import alunosRoutes from './alunoRoutes';
import parentescosRoutes from './parentescoRoutes';
import responsaveisRoutes from './responsavelRoutes';
import professoresRoutes from './professorRoutes';

// Create a plugin with all the routes as plugins
// Remember FastifyPlugin equals JS object
const routes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // Define all the prefix routes
  server.register(alunosRoutes, { prefix: '/api/alunos' });
  server.register(parentescosRoutes, { prefix: '/api/parentescos' });
  server.register(responsaveisRoutes, { prefix: '/api/responsaveis' });
  server.register(professoresRoutes, { prefix: '/api/professores' });
};
export default routes; // Export the all routes
