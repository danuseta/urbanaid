const Hapi = require('@hapi/hapi');
const jwt = require('hapi-auth-jwt2');
const Path = require('path');
const Inert = require('@hapi/inert');
const authRoutes = require('./routes/auth.routes');
const statisticsRoutes = require('./routes/statistics.routes');
const reportRoutes = require('./routes/report.routes');
const riwayatRoutes = require('./routes/riwayat.routes');
const reviewRoutes = require('./routes/review.routes');
const superadminRoutes = require('./routes/superadmin.routes');
require('dotenv').config();

const validate = async (decoded, request, h) => {
  if (request.path.startsWith('/api/superadmin') && decoded.role !== 'superadmin') {
    return { isValid: false };
  }
  return { isValid: true, credentials: decoded };
};

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || '0.0.0.0',
    routes: {
      cors: {
        origin: [
          'https://urbanaid-client.vercel.app',
          'http://localhost:3000'
        ],
        headers: [
          'Accept',
          'Authorization',
          'Content-Type',
          'If-None-Match',
          'X-Requested-With',
          'cache-control',
          'Origin',
          'Access-Control-Request-Method',
          'Access-Control-Request-Headers'
        ],
        credentials: true,
        maxAge: 600
      },
      files: {
        relativeTo: Path.join(__dirname, 'public')
      }
    },
  });

  // Register plugins
  await server.register([
    { plugin: jwt },
    { plugin: Inert }
  ]);

  // Health check route - no auth required
  server.route({
    method: 'GET',
    path: '/',
    options: {
      auth: false
    },
    handler: (request, h) => {
      return { 
        status: 'healthy', 
        message: 'Server is running',
        timestamp: new Date().toISOString()
      };
    }
  });

  // Configure JWT authentication
  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET,
    validate,
    verifyOptions: { 
      algorithms: ['HS256'],
      ignoreExpiration: false
    }
  });

  // Set default auth strategy
  server.auth.default('jwt');

  // Static assets route - no auth required
  server.route({
    method: 'GET',
    path: '/assets/{param*}',
    options: {
      auth: false
    },
    handler: {
      directory: {
        path: '.',
        redirectToSlash: true,
        index: true,
      }
    }
  });

  // Global API route configuration
  server.route({
    method: ['POST', 'PUT', 'PATCH', 'DELETE'],
    path: '/api/{param*}',
    options: {
      payload: {
        parse: true,
        allow: ['application/json'],
        maxBytes: 1048576 // 1MB
      }
    },
    handler: (request, h) => h.continue
  });

  // Auth routes configuration - no auth required for login/register
  // server.route({
  //   method: 'POST',
  //   path: '/api/auth/{param*}',
  //   options: {
  //     auth: false,
  //     payload: {
  //       parse: true,
  //       allow: ['application/json']
  //     }
  //   },
  //   handler: (request, h) => h.continue
  // });

  // Combine all routes
  const routes = [
    ...authRoutes,
    ...statisticsRoutes,
    ...reportRoutes,
    ...riwayatRoutes,
    ...reviewRoutes,
    ...superadminRoutes
  ];

  server.route(routes);

  // Catch-all route for SPA - no auth required
  // server.route({
  //   method: 'GET',
  //   path: '/{path*}',
  //   options: {
  //     auth: false
  //   },
  //   handler: {
  //     file: 'index.html'
  //   }
  // });

  // Global error handling
  server.ext('onPreResponse', (request, h) => {
    const response = request.response;
    
    if (!response.isBoom) {
      return h.continue;
    }

    // Handle specific error cases
    switch (response.output.statusCode) {
      case 401:
        return h.response({
          statusCode: 401,
          error: 'Unauthorized',
          message: response.message || 'Missing or invalid authentication token'
        }).code(401);
      
      case 403:
        return h.response({
          statusCode: 403,
          error: 'Forbidden',
          message: response.message || 'You do not have permission to access this resource'
        }).code(403);
      
      case 404:
        return h.response({
          statusCode: 404,
          error: 'Not Found',
          message: response.message || 'The requested resource was not found'
        }).code(404);
      
      default:
        return h.response({
          statusCode: response.output.statusCode,
          error: response.output.payload.error,
          message: response.message || 'An internal server error occurred'
        }).code(response.output.statusCode);
    }
  });

  // Log registered routes on startup
  server.ext('onPreStart', () => {
    console.log('Registering routes:');
    routes.forEach((route) => {
      if (Array.isArray(route.method)) {
        route.method.forEach((method) => {
          console.log(`  ${method.toUpperCase()} ${route.path}`);
        });
      } else {
        console.log(`  ${route.method.toUpperCase()} ${route.path}`);
      }
    });
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
  console.log('Environment:', process.env.NODE_ENV);
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

init();