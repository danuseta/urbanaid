describe('ReportService', () => {
    let ReportService;
    let originalFetch;
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
  
      mockLocalStorage.store.token = 'fake-token';
  
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
  
      originalFetch = global.fetch;
      global.fetch = jest.fn();
  
      ReportService = require('../../src/services/report-service').default;
    });
  
    afterEach(() => {
      global.fetch = originalFetch;
      jest.clearAllMocks();
    });
  
    describe('createReport', () => {
      test('should successfully create report', async () => {
        const mockFormData = new FormData();
        mockFormData.append('title', 'Test Report');
  
        const mockResponse = {
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            data: { id: 1, title: 'Test Report' }
          })
        };
  
        global.fetch.mockResolvedValueOnce(mockResponse);
  
        const result = await ReportService.createReport(mockFormData);
  
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:5000/api/reports',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Authorization': 'Bearer fake-token'
            },
            body: mockFormData
          })
        );
  
        expect(result.data).toEqual({
          id: 1,
          title: 'Test Report'
        });
      });
  
      test('should handle file size error', async () => {
        const mockResponse = {
          ok: false,
          status: 413,
          json: () => Promise.resolve({
            message: 'File too large'
          })
        };
  
        global.fetch.mockResolvedValueOnce(mockResponse);
  
        await expect(
          ReportService.createReport(new FormData())
        ).rejects.toThrow('Ukuran file terlalu besar. Maksimal 8MB');
      });
  
      test('should handle network error', async () => {
        global.fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));
  
        await expect(
          ReportService.createReport(new FormData())
        ).rejects.toThrow('Gagal terhubung ke server. Periksa koneksi internet Anda.');
      });
    });
  
    describe('getUserReports', () => {
      test('should fetch user reports successfully', async () => {
        const mockReports = [
          { id: 1, title: 'Report 1' },
          { id: 2, title: 'Report 2' }
        ];
  
        const mockResponse = {
          ok: true,
          json: () => Promise.resolve({ data: mockReports })
        };
  
        global.fetch.mockResolvedValueOnce(mockResponse);
  
        const result = await ReportService.getUserReports();
  
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:5000/api/reports/user',
          expect.objectContaining({
            headers: {
              'Authorization': 'Bearer fake-token'
            }
          })
        );
  
        expect(result).toEqual(mockReports);
      });
  
      test('should handle error when fetching user reports', async () => {
        const mockResponse = {
          ok: false,
          json: () => Promise.resolve({
            message: 'Failed to fetch reports'
          })
        };
  
        global.fetch.mockResolvedValueOnce(mockResponse);
  
        await expect(ReportService.getUserReports())
          .rejects.toThrow('Failed to fetch reports');
      });
    });
  
    describe('getReportDetail', () => {
      test('should fetch report detail successfully', async () => {
        const mockReport = {
          id: 1,
          title: 'Test Report',
          description: 'Test Description'
        };
  
        const mockResponse = {
          ok: true,
          json: () => Promise.resolve({ data: mockReport })
        };
  
        global.fetch.mockResolvedValueOnce(mockResponse);
  
        const result = await ReportService.getReportDetail(1);
        
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:5000/api/reports/detail/1',
          expect.objectContaining({
            headers: {
              'Authorization': 'Bearer fake-token',
              'Content-Type': 'application/json'
            }
          })
        );
  
        expect(result).toEqual(mockReport);
      });
  
      test('should throw error when ID is not provided', async () => {
        await expect(ReportService.getReportDetail())
          .rejects.toThrow('ID is required');
      });
    });
  
    describe('acceptReport', () => {
      test('should accept report successfully', async () => {
        const mockResponse = {
          ok: true,
          json: () => Promise.resolve({
            message: 'Report accepted successfully'
          })
        };
  
        global.fetch.mockResolvedValueOnce(mockResponse);
  
        const result = await ReportService.acceptReport(1, 'Accepted');
  
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:5000/api/reports/1/accept',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Authorization': 'Bearer fake-token',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ keterangan: 'Accepted' })
          })
        );
  
        expect(result.message).toBe('Report accepted successfully');
      });
  
      test('should handle missing token', async () => {
        mockLocalStorage.store = {}; 
  
        await expect(ReportService.acceptReport(1, 'Accepted'))
          .rejects.toThrow('Token tidak ditemukan');
      });
    });
  
    describe('rejectReport', () => {
      test('should reject report successfully', async () => {
        const mockResponse = {
          ok: true,
          json: () => Promise.resolve({
            message: 'Report rejected successfully'
          })
        };
  
        global.fetch.mockResolvedValueOnce(mockResponse);
  
        const result = await ReportService.rejectReport(1, 'Rejected');
  
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:5000/api/reports/1/reject',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Authorization': 'Bearer fake-token',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ keterangan: 'Rejected' })
          })
        );
  
        expect(result.message).toBe('Report rejected successfully');
      });
  
      test('should handle missing token', async () => {
        mockLocalStorage.store = {};
  
        await expect(ReportService.rejectReport(1, 'Rejected'))
          .rejects.toThrow('Token tidak ditemukan. Silakan login kembali.');
      });
    });
  
    describe('getIncomingReports', () => {
      test('should fetch incoming reports successfully', async () => {
        const mockReports = [
          { id: 1, status: 'pending' },
          { id: 2, status: 'pending' }
        ];
  
        const mockResponse = {
          ok: true,
          json: () => Promise.resolve({ data: mockReports })
        };
  
        global.fetch.mockResolvedValueOnce(mockResponse);
  
        const result = await ReportService.getIncomingReports();
  
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:5000/api/reports/incoming',
          expect.objectContaining({
            headers: {
              'Authorization': 'Bearer fake-token',
              'Content-Type': 'application/json'
            }
          })
        );
  
        expect(result).toEqual(mockReports);
      });
  
      test('should handle unauthorized access', async () => {
        const mockResponse = {
          ok: false,
          status: 401,
          json: () => Promise.resolve({
            message: 'Unauthorized'
          })
        };
  
        global.fetch.mockResolvedValueOnce(mockResponse);
  
        await expect(ReportService.getIncomingReports())
          .rejects.toThrow('Sesi anda telah berakhir, silahkan login kembali');
  
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
        expect(window.location.href).toBe('/login');
      });
    });
  
    describe('updateReport', () => {
      test('should update report successfully', async () => {
        const mockFormData = new FormData();
        mockFormData.append('title', 'Updated Report');
  
        const mockResponse = {
          ok: true,
          json: () => Promise.resolve({
            data: { id: 1, title: 'Updated Report' }
          })
        };
  
        global.fetch.mockResolvedValueOnce(mockResponse);
  
        const result = await ReportService.updateReport(1, mockFormData);
  
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:5000/api/reports/1',
          expect.objectContaining({
            method: 'PUT',
            headers: {
              'Authorization': 'Bearer fake-token'
            },
            body: mockFormData
          })
        );
  
        expect(result).toEqual({ id: 1, title: 'Updated Report' });
      });
    });
  
    describe('deleteReport', () => {
      test('should delete report successfully', async () => {
        const mockResponse = {
          ok: true,
          json: () => Promise.resolve({
            message: 'Report deleted successfully'
          })
        };
  
        global.fetch.mockResolvedValueOnce(mockResponse);
  
        const result = await ReportService.deleteReport(1);
  
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:5000/api/reports/1',
          expect.objectContaining({
            method: 'DELETE',
            headers: {
              'Authorization': 'Bearer fake-token'
            }
          })
        );
  
        expect(result.message).toBe('Report deleted successfully');
      });
    });
  });