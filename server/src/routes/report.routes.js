const ReportController = require('../controllers/report-controller');
const { validateToken, verifyAdmin } = require('../middleware/auth');

const routes = [
  {
    method: 'POST',
    path: '/api/reports',
    handler: ReportController.createReport,
    options: {
      auth: 'jwt',
      payload: {
        output: 'file',
        parse: true,
        multipart: true,
        maxBytes: 10 * 1024 * 1024,
        allow: 'multipart/form-data'
      },
      plugins: {
        'hapi-multipart': {
          output: 'stream'
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/reports',
    handler: ReportController.getReports,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/api/reports/user',
    handler: ReportController.getReportsByUser,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/api/reports/{id}',
    handler: ReportController.getReportById,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'PUT',
    path: '/api/reports/{id}',
    handler: ReportController.updateReport,
    options: {
      auth: 'jwt',
      payload: {
        output: 'file',
        parse: true,
        multipart: true,
        maxBytes: 10 * 1024 * 1024, // 10MB
        allow: 'multipart/form-data'
      },
      plugins: {
        'hapi-multipart': {
          output: 'stream'
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/reports/{id}',
    handler: ReportController.deleteReport,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/api/reports/nearby',
    handler: ReportController.getNearbyReports,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/api/reports/incoming',
    handler: ReportController.getIncomingReports,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/api/reports/detail/{id}',
    handler: ReportController.getReportDetail,
    options: {
      auth: 'jwt'
    }
  },

  {
    method: 'POST',
    path: '/api/reports/{id}/accept',
    handler: ReportController.acceptReport,
    options: {
      auth: 'jwt',
      pre: [validateToken, verifyAdmin]
    }
  },
  {
    method: 'POST',
    path: '/api/reports/{id}/reject',
    handler: ReportController.rejectReport,
    options: {
      auth: 'jwt',
      pre: [validateToken, verifyAdmin]
    }
  }
];

module.exports = routes;