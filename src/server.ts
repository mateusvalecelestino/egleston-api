import fastify from 'fastify';
import routes from './routes'; // Import all registered routes
import HttpStatusCodes from './utils/HttpStatusCodes';
import errorHandlerPlugin from './plugins/errorHandler';
import swaggerDocs from './plugins/swagger';
import zodTypeProvider from './plugins/zod';
import NotFoundRequest from './utils/NotFoundRequest';

// Instantiate the server
const server = fastify();
server.register(swaggerDocs);
server.register(zodTypeProvider);
server.register(errorHandlerPlugin);
server.register(routes); // Register all the routes to API

// Define the 404 route
server.setNotFoundHandler(() => {
  throw new NotFoundRequest('Route not found');
});

const SERVER_PORT = Number(process.env.SERVER_PORT || 8000);

// Initiate the server
server
  .listen({ port: SERVER_PORT })
  .then(() => {
    console.log(`🔥 API Running on :${SERVER_PORT}`);
  })
  .catch((err) => {
    console.error(`🛑 Error starting API: \n ${err}`);
    process.exit(1);
  });
