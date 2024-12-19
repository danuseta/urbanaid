// import AuthService from '../src/services/auth-service';

// describe('AuthService', () => {
//   beforeEach(() => {
//     fetch.resetMocks();
//   });

//   describe('login', () => {
//     it('should successfully login user with correct credentials', async () => {
//       const mockResponse = {
//         success: true,
//         data: {
//           token: 'fake-token',
//           user: { id: 1, email: 'test@example.com' }
//         }
//       };
      
//       fetch.mockResponseOnce(JSON.stringify(mockResponse));

//       const credentials = {
//         email: 'test@example.com',
//         password: 'password123'
//       };

//       const response = await AuthService.login(credentials);
      
//       expect(response).toEqual(mockResponse);
//       expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(credentials)
//       });
//     });

//     it('should handle login failure', async () => {
//       const mockError = {
//         success: false,
//         message: 'Invalid credentials'
//       };
      
//       fetch.mockResponseOnce(JSON.stringify(mockError), { status: 401 });

//       const credentials = {
//         email: 'wrong@example.com',
//         password: 'wrongpass'
//       };

//       await expect(AuthService.login(credentials)).rejects.toThrow('Invalid credentials');
//     });
//   });
// });