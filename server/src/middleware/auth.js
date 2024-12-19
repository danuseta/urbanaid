const jwt = require('jsonwebtoken');

const validateToken = {
  assign: 'user',
  method: async (request, h) => {
    try {
      const token = request.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return h.response({
          status: 'fail',
          message: 'Token tidak ditemukan',
        }).code(401).takeover();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      return h.response({
        status: 'fail',
        message: 'Token tidak valid',
      }).code(401).takeover();
    }
  },
};

const verifyAdmin = {
  assign: 'isAdmin',
  method: async (request, h) => {
    try {
      const token = request.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return h.response({
          status: 'fail',
          message: 'Token tidak ditemukan',
        }).code(401).takeover();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded.isAdmin && decoded.role !== 'admin' && decoded.role !== 'superadmin') {
        return h.response({
          status: 'fail',
          message: 'Akses ditolak. Hanya admin yang diizinkan.',
        }).code(403).takeover();
      }

      return decoded;
    } catch (error) {
      return h.response({
        status: 'fail',
        message: 'Token tidak valid',
      }).code(401).takeover();
    }
  },
};

const verifySuperAdmin = {
  assign: 'isSuperAdmin',
  method: async (request, h) => {
    try {
      const token = request.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return h.response({
          status: 'fail',
          message: 'Token tidak ditemukan',
        }).code(401).takeover();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role !== 'superadmin') {
        return h.response({
          status: 'fail',
          message: 'Akses ditolak. Hanya super admin yang diizinkan.',
        }).code(403).takeover();
      }

      return decoded;
    } catch (error) {
      return h.response({
        status: 'fail',
        message: 'Token tidak valid',
      }).code(401).takeover();
    }
  },
};

module.exports = { validateToken, verifyAdmin, verifySuperAdmin };