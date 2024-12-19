const SuperAdminController = require('../controllers/superadmin-controller');
const { validateToken, verifySuperAdmin } = require('../middleware/auth');

const routes = [
  {
    method: 'GET',
    path: '/api/superadmin/admins',
    options: {
      pre: [validateToken, verifySuperAdmin],
      handler: SuperAdminController.getAllAdmins
    }
  },
  {
    method: 'GET',
    path: '/api/superadmin/admins/{id}',
    options: {
      pre: [validateToken, verifySuperAdmin],
      handler: SuperAdminController.getAdminById
    }
  },
  {
    method: 'POST',
    path: '/api/superadmin/admins',
    options: {
      pre: [validateToken, verifySuperAdmin],
      handler: SuperAdminController.createAdmin
    }
  },
  {
    method: 'PUT',
    path: '/api/superadmin/admins/{id}',
    options: {
      pre: [validateToken, verifySuperAdmin],
      handler: SuperAdminController.updateAdmin
    }
  },
  {
    method: 'DELETE',
    path: '/api/superadmin/admins/{id}',
    options: {
      pre: [validateToken, verifySuperAdmin],
      handler: SuperAdminController.deleteAdmin
    }
  },

  {
    method: 'GET',
    path: '/api/superadmin/users',
    options: {
      pre: [validateToken, verifySuperAdmin],
      handler: SuperAdminController.getAllUsers
    }
  },
  {
    method: 'GET',
    path: '/api/superadmin/users/{id}',
    options: {
      pre: [validateToken, verifySuperAdmin],
      handler: SuperAdminController.getUserById
    }
  },
  {
    method: 'PUT',
    path: '/api/superadmin/users/{id}',
    options: {
      pre: [validateToken, verifySuperAdmin],
      handler: SuperAdminController.updateUser
    }
  },
  {
    method: 'DELETE',
    path: '/api/superadmin/users/{id}',
    options: {
      pre: [validateToken, verifySuperAdmin],
      handler: SuperAdminController.deleteUser
    }
  },

  {
    method: 'GET',
    path: '/api/superadmin/statistics',
    options: {
      pre: [validateToken, verifySuperAdmin],
      handler: SuperAdminController.getStatistics
    }
  }
];

module.exports = routes;