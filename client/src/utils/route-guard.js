import AuthService from '../services/auth-service';

const RouteGuard = {
  checkSuperAdmin(page) {
    return {
      ...page,
      async init() {
        try {
          if (!AuthService.isAuthenticated()) {
            window.location.href = '/login';
            return;
          }

          if (!AuthService.isSuperAdmin()) {
            window.location.href = '/admin';
            return;
          }

          if (typeof page.init === 'function') {
            await page.init();
          }
        } catch (error) {
          console.error('Error in route guard:', error);
          window.location.href = '/login';
        }
      }
    };
  },

  checkAdmin(page) {
    return {
      ...page,
      async init() {
        try {
          if (!AuthService.isAuthenticated()) {
            window.location.href = '/login';
            return;
          }

          if (!AuthService.isAdmin() && !AuthService.isSuperAdmin()) {
            window.location.href = '/pelaporan';
            return;
          }

          if (typeof page.init === 'function') {
            await page.init();
          }
        } catch (error) {
          console.error('Error in route guard:', error);
          window.location.href = '/login';
        }
      }
    };
  },

  checkUser(page) {
    return {
      ...page,
      async init() {
        try {
          if (!AuthService.isAuthenticated()) {
            window.location.href = '/login';
            return;
          }

          if (AuthService.isAdmin() || AuthService.isSuperAdmin()) {
            window.location.href = '/admin';
            return;
          }

          if (typeof page.init === 'function') {
            await page.init();
          }
        } catch (error) {
          console.error('Error in route guard:', error);
          window.location.href = '/login';
        }
      }
    };
  },

  checkAuth(page) {
    return {
      ...page,
      async init() {
        try {
          if (!AuthService.isAuthenticated()) {
            window.location.href = '/login';
            return;
          }

          if (typeof page.init === 'function') {
            await page.init();
          }
        } catch (error) {
          console.error('Error in route guard:', error);
          window.location.href = '/login';
        }
      }
    };
  },

  publicOnly(page) {
    return {
      ...page,
      async init() {
        try {
          if (AuthService.isAuthenticated()) {
            const redirectUrl = AuthService.getRedirectUrl();
            window.location.href = new URL(redirectUrl).pathname;
            return;
          }

          if (typeof page.init === 'function') {
            await page.init();
          }
        } catch (error) {
          console.error('Error in route guard:', error);
        }
      }
    };
  }
};

export default RouteGuard;