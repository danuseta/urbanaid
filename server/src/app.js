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
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['https://urbanaid-client.vercel.app'], 
        headers: ['Accept', 'Authorization', 'Content-Type', 'X-Requested-With'],
        additionalHeaders: [
          'cache-control', 
          'x-requested-with',
          'Origin',
          'Accept',
          'Access-Control-Request-Method',
          'Access-Control-Request-Headers'
        ],
        credentials: true,
        maxAge: 600
      },
      // files: {
      //   relativeTo: Path.join(__dirname, '../client/dist')
      // }
    },
  });

  await server.register([
    {
      plugin: jwt
    },
    {
      plugin: Inert
    }
  ]);

  server.route({
    method: 'GET',
    path: '/assets/{param*}',
    handler: {
      directory: {
        path: '.',
        redirectToSlash: true,
        index: true,
      }
    }
  });

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

  server.route({
    method: 'POST',
    path: '/api/auth/{param*}',
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

  server.route({
    method: 'POST',
    path: '/api/auth/{param*}',
    options: {
      auth: false,
      payload: {
        parse: true,
        allow: ['application/json']
      }
    },
    handler: (request, h) => h.continue
  });

  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET,
    validate,
    verifyOptions: { algorithms: ['HS256'] },
    verifyOptions: { algorithms: ['HS256'] },
  });

  server.auth.default('jwt');

  const routes = [
    ...authRoutes,
    ...statisticsRoutes,
    ...reportRoutes,
    ...riwayatRoutes,
    ...reviewRoutes,
    ...superadminRoutes
  ];

  server.route(routes);

  server.route({
    method: 'GET',
    path: '/{path*}',
    handler: {
      file: 'index.html'
    }
  });

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
  server.route(routes);

  server.route({
    method: 'GET',
    path: '/{path*}',
    handler: {
      file: 'index.html'
    }
  });

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
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  console.log(err);
  process.exit(1);
});

init();