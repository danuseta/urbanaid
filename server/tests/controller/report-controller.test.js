const ReportController = require('../../src/controllers/report-controller');
const ReportModel = require('../../src/models/reportModel');
const StorageService = require('../../src/services/storage');
const RiwayatModel = require('../../src/models/riwayatModel');

jest.mock('../../src/models/reportModel');
jest.mock('../../src/services/storage');
jest.mock('../../src/models/riwayatModel');

describe('ReportController', () => {
  let mockRequest;
  let mockH;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      payload: {},
      auth: {
        credentials: {
          id: 1
        }
      },
      params: {},
      query: {}
    };

    mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis()
    };
  });

  describe('createReport', () => {
    it('should successfully create a report', async () => {
      const reportData = {
        judul: 'Test Report',
        jenis_infrastruktur: 'Jalan',
        tanggal_kejadian: '2024-01-01',
        deskripsi: 'Test description',
        alamat: 'Test address',
        bukti_lampiran: 'test-file'
      };

      mockRequest.payload = reportData;
      StorageService.uploadFile.mockResolvedValue('file-url');
      ReportModel.createReport.mockResolvedValue({
        id: 1,
        ...reportData,
        bukti_lampiran: 'file-url'
      });

      await ReportController.createReport(mockRequest, mockH);

      expect(StorageService.uploadFile).toHaveBeenCalledWith(reportData.bukti_lampiran);
      expect(ReportModel.createReport).toHaveBeenCalled();
      expect(mockH.response).toHaveBeenCalledWith(expect.objectContaining({
        status: 'success'
      }));
      expect(mockH.code).toHaveBeenCalledWith(201);
    });
  });

  describe('getReportsByUser', () => {
    it('should return reports for a specific user', async () => {
      const mockReports = [
        { id: 1, judul: 'Report 1' },
        { id: 2, judul: 'Report 2' }
      ];

      ReportModel.getReportsByUserId.mockResolvedValue(mockReports);

      await ReportController.getReportsByUser(mockRequest, mockH);

      expect(ReportModel.getReportsByUserId).toHaveBeenCalledWith(mockRequest.auth.credentials.id);
      expect(mockH.response).toHaveBeenCalledWith(expect.objectContaining({
        status: 'success',
        data: mockReports
      }));
      expect(mockH.code).toHaveBeenCalledWith(200);
    });
  });

  describe('getNearbyReports', () => {
    it('should return reports near a location', async () => {
      mockRequest.query = {
        latitude: '1.23',
        longitude: '4.56',
        radius: '10'
      };

      const mockReports = [
        { id: 1, judul: 'Nearby Report 1' },
        { id: 2, judul: 'Nearby Report 2' }
      ];

      ReportModel.getReportsNearLocation.mockResolvedValue(mockReports);

      await ReportController.getNearbyReports(mockRequest, mockH);

      expect(ReportModel.getReportsNearLocation).toHaveBeenCalledWith(1.23, 4.56, 10);
      expect(mockH.response).toHaveBeenCalledWith(expect.objectContaining({
        status: 'success',
        data: mockReports
      }));
      expect(mockH.code).toHaveBeenCalledWith(200);
    });

    it('should return error if latitude or longitude is missing', async () => {
      mockRequest.query = {};

      await ReportController.getNearbyReports(mockRequest, mockH);

      expect(mockH.response).toHaveBeenCalledWith(expect.objectContaining({
        status: 'fail',
        message: 'Latitude dan longitude diperlukan'
      }));
      expect(mockH.code).toHaveBeenCalledWith(400);
    });
  });
});
