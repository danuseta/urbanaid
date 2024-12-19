const AuthController = require('../controllers/auth-controller');
const { validateToken } = require('../middleware/auth');
const routes = [
  {
    method: 'POST',
    path: '/api/auth/register',
    handler: AuthController.register,
    options: {
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/api/auth/login',
    handler: AuthController.login,
    options: {
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/api/auth/admin/create',
    handler: AuthController.createAdmin,
    options: {
      auth: 'jwt',
      pre: [validateToken],
    },
  },
  {
    method: 'PUT',
    path: '/api/auth/profile/{id}',
    handler: AuthController.updateProfile,
    options: {
      auth: 'jwt',
    },
  },
  {
    method: 'PUT',
    path: '/api/auth/admin/profile/{id}',
    handler: AuthController.updateAdminProfile,
    options: {
      auth: 'jwt',
      pre: [validateToken],
    },
  },
  {
    method: 'POST',
    path: '/api/auth/reset-password',
    handler: AuthController.resetPassword,
    options: {
      auth: false,
    }
  }
];
module.exports = routes;