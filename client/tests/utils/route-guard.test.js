import RouteGuard from '../../src/utils/route-guard';
import AuthService from '../../src/services/auth-service';

jest.mock('../../src/services/auth-service');

describe('Route Guard', () => {
  let mockPage;

  beforeEach(() => {
    mockPage = {
      init: jest.fn()
    };

    delete window.location;
    window.location = {
      href: '/'
    };

    jest.clearAllMocks();
  });

  describe('checkSuperAdmin', () => {
    test('should redirect to login if not authenticated', async () => {
      AuthService.isAuthenticated.mockReturnValue(false);
      
      const guardedPage = RouteGuard.checkSuperAdmin(mockPage);
      await guardedPage.init();

      expect(window.location.href).toBe('/login');
      expect(mockPage.init).not.toHaveBeenCalled();
    });

    test('should redirect to admin if not super admin', async () => {
      AuthService.isAuthenticated.mockReturnValue(true);
      AuthService.isSuperAdmin.mockReturnValue(false);
      
      const guardedPage = RouteGuard.checkSuperAdmin(mockPage);
      await guardedPage.init();

      expect(window.location.href).toBe('/admin');
      expect(mockPage.init).not.toHaveBeenCalled();
    });

    test('should allow access for super admin users', async () => {
      AuthService.isAuthenticated.mockReturnValue(true);
      AuthService.isSuperAdmin.mockReturnValue(true);
      
      const guardedPage = RouteGuard.checkSuperAdmin(mockPage);
      await guardedPage.init();

      expect(mockPage.init).toHaveBeenCalled();
      expect(window.location.href).toBe('/');
    });

    test('should handle authentication errors', async () => {
      AuthService.isAuthenticated.mockImplementation(() => {
        throw new Error('Authentication error');
      });
      
      const guardedPage = RouteGuard.checkSuperAdmin(mockPage);
      await guardedPage.init();

      expect(window.location.href).toBe('/login');
      expect(mockPage.init).not.toHaveBeenCalled();
    });
  });

  describe('checkAdmin', () => {
    test('should allow access for admin users', async () => {
      AuthService.isAuthenticated.mockReturnValue(true);
      AuthService.isAdmin.mockReturnValue(true);
      AuthService.isSuperAdmin.mockReturnValue(false);
      
      const guardedPage = RouteGuard.checkAdmin(mockPage);
      await guardedPage.init();

      expect(mockPage.init).toHaveBeenCalled();
      expect(window.location.href).toBe('/');
    });

    test('should allow access for super admin users', async () => {
      AuthService.isAuthenticated.mockReturnValue(true);
      AuthService.isAdmin.mockReturnValue(false);
      AuthService.isSuperAdmin.mockReturnValue(true);
      
      const guardedPage = RouteGuard.checkAdmin(mockPage);
      await guardedPage.init();

      expect(mockPage.init).toHaveBeenCalled();
      expect(window.location.href).toBe('/');
    });

    test('should redirect to login if not authenticated', async () => {
      AuthService.isAuthenticated.mockReturnValue(false);
      
      const guardedPage = RouteGuard.checkAdmin(mockPage);
      await guardedPage.init();

      expect(window.location.href).toBe('/login');
      expect(mockPage.init).not.toHaveBeenCalled();
    });

    test('should redirect to pelaporan if not admin or super admin', async () => {
      AuthService.isAuthenticated.mockReturnValue(true);
      AuthService.isAdmin.mockReturnValue(false);
      AuthService.isSuperAdmin.mockReturnValue(false);
      
      const guardedPage = RouteGuard.checkAdmin(mockPage);
      await guardedPage.init();

      expect(window.location.href).toBe('/pelaporan');
      expect(mockPage.init).not.toHaveBeenCalled();
    });

    test('should handle authentication errors', async () => {
      AuthService.isAuthenticated.mockImplementation(() => {
        throw new Error('Authentication error');
      });
      
      const guardedPage = RouteGuard.checkAdmin(mockPage);
      await guardedPage.init();

      expect(window.location.href).toBe('/login');
      expect(mockPage.init).not.toHaveBeenCalled();
    });
  });

  describe('checkUser', () => {
    test('should allow access for regular users', async () => {
      AuthService.isAuthenticated.mockReturnValue(true);
      
      const guardedPage = RouteGuard.checkUser(mockPage);
      await guardedPage.init();

      expect(mockPage.init).toHaveBeenCalled();
      expect(window.location.href).toBe('/');
    });

    test('should redirect to login if not authenticated', async () => {
      AuthService.isAuthenticated.mockReturnValue(false);
      
      const guardedPage = RouteGuard.checkUser(mockPage);
      await guardedPage.init();

      expect(window.location.href).toBe('/login');
      expect(mockPage.init).not.toHaveBeenCalled();
    });

    test('should handle authentication errors', async () => {
      AuthService.isAuthenticated.mockImplementation(() => {
        throw new Error('Authentication error');
      });
      
      const guardedPage = RouteGuard.checkUser(mockPage);
      await guardedPage.init();

      expect(window.location.href).toBe('/login');
      expect(mockPage.init).not.toHaveBeenCalled();
    });
  });
});