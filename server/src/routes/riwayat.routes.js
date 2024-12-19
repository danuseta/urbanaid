const RiwayatController = require('../controllers/riwayat-controller');

const routes = [
  {
    method: 'GET',
    path: '/api/riwayat',
    handler: RiwayatController.getAllRiwayat,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/api/riwayat/user',
    handler: RiwayatController.getRiwayatByUser,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/api/riwayat/{id}',
    handler: RiwayatController.getRiwayatById,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/api/riwayat/admin',
    handler: RiwayatController.getAdminRiwayat,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/api/riwayat/detail/{id}',
    handler: RiwayatController.getDetailRiwayat,
    options: {
      auth: 'jwt'
    }
  }
];

module.exports = routes;