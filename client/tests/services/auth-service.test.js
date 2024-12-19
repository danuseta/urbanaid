describe('AuthService', () => {
    let AuthService;
    let mockLocalStorage;
  
    beforeEach(() => {
      mockLocalStorage = {
        store: {},
        getItem: jest.fn(key => mockLocalStorage.store[key] || null),
        setItem: jest.fn((key, value) => {
          mockLocalStorage.store[key] = value;
        }),
        removeItem: jest.fn(key => {
          delete mockLocalStorage.store[key];
        }),
        clear: jest.fn(() => {
          mockLocalStorage.store = {};
        })
      };
  
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true
      });
  
      delete window.location;
      window.location = { 
        href: '',
        pathname: '',
        replace: jest.fn()
      };
  
      global.fetch = jest.fn();
  
      jest.resetModules();
      AuthService = require('../../src/services/auth-service').default;
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('login', () => {
      test('successful login should store token and user data', async () => {
        const mockResponse = {
          ok: true,
          json: () => Promise.resolve({
            data: {
              token: 'fake-token',
              user: { id: 1, name: 'Test User' }
            }
          })
        };
        global.fetch.mockResolvedValueOnce(mockResponse);
  
        await AuthService.login('test@email.com', 'password123');
  
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', 'fake-token');
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          'user', 
          JSON.stringify({ id: 1, name: 'Test User' })
        );
      });
  
      test('failed login should not store data', async () => {
        const mockResponse = {
          ok: false,
          json: () => Promise.resolve({
            message: 'Invalid credentials'
          })
        };
        global.fetch.mockResolvedValueOnce(mockResponse);
  
        await AuthService.login('test@email.com', 'wrong-password');
  
        expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
      });
    });
  
    describe('isAuthenticated', () => {
      test('should return true for valid non-expired token', () => {
        const futureTime = Math.floor(Date.now() / 1000) + 3600; 
        const mockToken = `header.${btoa(JSON.stringify({ exp: futureTime }))}.signature`;
        
        mockLocalStorage.store = {
          token: mockToken,
          user: JSON.stringify({ id: 1, name: 'Test User' })
        };
  
        expect(AuthService.isAuthenticated()).toBe(true);
      });
  
      test('should return false for expired token', () => {
        const pastTime = Math.floor(Date.now() / 1000) - 3600; 
        const mockToken = `header.${btoa(JSON.stringify({ exp: pastTime }))}.signature`;
        
        mockLocalStorage.store = {
          token: mockToken,
          user: JSON.stringify({ id: 1 })
        };
  
        expect(AuthService.isAuthenticated()).toBe(false);
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
      });
    });
  
    describe('hasAdminAccess', () => {
      test('should return true for admin user', () => {
        mockLocalStorage.store = {
          user: JSON.stringify({ role: 'admin' })
        };
        expect(AuthService.hasAdminAccess()).toBe(true);
      });
  
      test('should return true for superadmin user', () => {
        mockLocalStorage.store = {
          user: JSON.stringify({ role: 'superadmin' })
        };
        expect(AuthService.hasAdminAccess()).toBe(true);
      });
  
      test('should return false for regular user', () => {
        mockLocalStorage.store = {
          user: JSON.stringify({ role: 'user' })
        };
        expect(AuthService.hasAdminAccess()).toBe(false);
      });
    });
  
    describe('logout', () => {
      test('should clear localStorage and redirect to login', () => {
        mockLocalStorage.store = {
          token: 'some-token',
          user: JSON.stringify({ id: 1 }),
          remember_token: 'remember-token'
        };
  
        AuthService.logout();
  
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user');
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('remember_token');
        expect(window.location.href).toBe('/login');
      });
    });
  
    describe('getRedirectUrl', () => {
      test('should return admin URL for admin user', () => {
        mockLocalStorage.store = {
          user: JSON.stringify({ role: 'admin' })
        };
        expect(AuthService.getRedirectUrl()).toBe('http://localhost:9000/admin');
      });
  
      test('should return management URL for superadmin', () => {
        mockLocalStorage.store = {
          user: JSON.stringify({ role: 'superadmin' })
        };
        expect(AuthService.getRedirectUrl()).toBe('http://localhost:9000/admin/management');
      });
  
      test('should return pelaporan URL for regular user', () => {
        mockLocalStorage.store = {
          user: JSON.stringify({ role: 'user' })
        };
        expect(AuthService.getRedirectUrl()).toBe('http://localhost:9000/pelaporan');
      });
    });
  });