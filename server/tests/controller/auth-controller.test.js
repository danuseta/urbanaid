const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuthController = require('../../src/controllers/auth-controller');
const UserModel = require('../../src/models/userModel');
const AdminModel = require('../../src/models/adminModel');
const db = require('../../src/config/database');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../src/models/userModel');
jest.mock('../../src/models/adminModel');
jest.mock('../../src/config/database.js');

describe('AuthController', () => {
  let mockRequest;
  let mockH;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      payload: {},
      auth: {
        credentials: {
          id: 1,
          role: 'user'
        }
      },
      params: {}
    };

    mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis()
    };
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const userData = {
        nama: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      mockRequest.payload = userData;

      UserModel.findByEmail.mockResolvedValue(null);
      AdminModel.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      UserModel.create.mockResolvedValue({
        id: 1,
        ...userData,
        role: 'user'
      });

      await AuthController.register(mockRequest, mockH);

      expect(UserModel.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(AdminModel.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(UserModel.create).toHaveBeenCalled();
      expect(mockH.response).toHaveBeenCalledWith(expect.objectContaining({
        status: 'success'
      }));
      expect(mockH.code).toHaveBeenCalledWith(201);
    });

    it('should return error if email already exists', async () => {
      mockRequest.payload = {
        email: 'existing@example.com',
        password: 'password123'
      };

      UserModel.findByEmail.mockResolvedValue({ id: 1 });

      await AuthController.register(mockRequest, mockH);

      expect(mockH.response).toHaveBeenCalledWith(expect.objectContaining({
        status: 'fail',
        message: 'Email sudah terdaftar'
      }));
      expect(mockH.code).toHaveBeenCalledWith(400);
    });
  });

  describe('login', () => {
    const loginPayload = {
      email: 'test@example.com',
      password: 'password123',
      remember: true
    };

    beforeEach(() => {
      mockRequest.payload = loginPayload;
      process.env.JWT_SECRET = 'test-secret';
      process.env.JWT_EXPIRES_IN = '1h';
    });

    it('should successfully login a user', async () => {
      const mockUser = {
        id: 1,
        email: loginPayload.email,
        password: 'hashedPassword',
        role: 'user'
      };

      UserModel.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mock-token');

      await AuthController.login(mockRequest, mockH);

      expect(UserModel.findByEmail).toHaveBeenCalledWith(loginPayload.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginPayload.password, mockUser.password);
      expect(jwt.sign).toHaveBeenCalled();
      expect(mockH.response).toHaveBeenCalledWith(expect.objectContaining({
        status: 'success',
        data: expect.objectContaining({
          token: 'mock-token'
        })
      }));
      expect(mockH.code).toHaveBeenCalledWith(200);
    });

    it('should return error for invalid credentials', async () => {
      UserModel.findByEmail.mockResolvedValue(null);
      AdminModel.findByEmail.mockResolvedValue(null);

      await AuthController.login(mockRequest, mockH);

      expect(mockH.response).toHaveBeenCalledWith(expect.objectContaining({
        status: 'fail',
        message: 'Email atau password salah'
      }));
      expect(mockH.code).toHaveBeenCalledWith(401);
    });
  });
});