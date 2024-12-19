jest.mock('../../src/config/database.js', () => ({
  query: jest.fn(),
  connect: jest.fn()
}));

jest.mock('https', () => ({
  request: jest.fn()
}));

jest.mock('../../src/utils/db-utils.js', () => ({
  getNextAvailableId: jest.fn()
}));

const db = require('../../src/config/database.js');
const https = require('https');
const dbUtils = require('../../src/utils/db-utils.js');
const ReportModel = require('../../src/models/reportModel.js');

describe('ReportModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('geocodeAddress', () => {
    test('should return coordinates for valid address', async () => {
      const mockResponse = {
        on: jest.fn(),
        statusCode: 200
      };
      const mockRequest = {
        on: jest.fn(),
        end: jest.fn()
      };

      https.request.mockImplementation((options, callback) => {
        callback(mockResponse);
        return mockRequest;
      });

      mockResponse.on.mockImplementation((event, callback) => {
        if (event === 'data') {
          callback(JSON.stringify([{
            lat: '-6.2088',
            lon: '106.8456'
          }]));
        }
        if (event === 'end') {
          callback();
        }
        return mockResponse;
      });

      const result = await ReportModel.geocodeAddress('Jakarta');

      expect(result).toEqual({
        latitude: -6.2088,
        longitude: 106.8456
      });
    });

    test('should return null for invalid address', async () => {
      const mockResponse = {
        on: jest.fn(),
        statusCode: 200
      };
      const mockRequest = {
        on: jest.fn(),
        end: jest.fn()
      };

      https.request.mockImplementation((options, callback) => {
        callback(mockResponse);
        return mockRequest;
      });

      mockResponse.on.mockImplementation((event, callback) => {
        if (event === 'data') {
          callback(JSON.stringify([]));
        }
        if (event === 'end') {
          callback();
        }
        return mockResponse;
      });

      const result = await ReportModel.geocodeAddress('NonexistentPlace123');
      expect(result).toBeNull();
    });
  });

  describe('createReport', () => {
    test('should create report successfully', async () => {
      const mockReportData = {
        judul: 'Test Report',
        jenis_infrastruktur: 'Jalan',
        tanggal_kejadian: new Date(),
        deskripsi: 'Test Description',
        alamat: 'Jakarta',
        bukti_lampiran: 'test.jpg',
        user_id: 1
      };

      const mockNextId = 1;
      dbUtils.getNextAvailableId.mockResolvedValue(mockNextId);

      const mockDbResponse = {
        rows: [{
          id: mockNextId,
          ...mockReportData
        }]
      };
      db.query.mockResolvedValue(mockDbResponse);

      jest.spyOn(ReportModel, 'geocodeAddress').mockResolvedValue({
        latitude: -6.2088,
        longitude: 106.8456
      });

      const result = await ReportModel.createReport(mockReportData);

      expect(result).toEqual(mockDbResponse.rows[0]);
      expect(db.query).toHaveBeenCalledWith(
        expect.objectContaining({
          text: expect.stringContaining('INSERT INTO laporan_masuk'),
          values: expect.arrayContaining([mockNextId])
        })
      );
    });
  });

  describe('getReportDetail', () => {
    test('should get report detail successfully', async () => {
      const mockReport = {
        id: 1,
        judul: 'Test Report',
        nama_pelapor: 'Test User'
      };

      db.query.mockResolvedValue({
        rows: [mockReport]
      });

      const result = await ReportModel.getReportDetail(1);
      expect(result).toEqual(mockReport);
    });

    test('should throw error when report not found', async () => {
      db.query.mockResolvedValue({
        rows: []
      });

      await expect(ReportModel.getReportDetail(999))
        .rejects
        .toThrow('Report not found');
    });
  });

  describe('getReportsNearLocation', () => {
    test('should get nearby reports successfully', async () => {
      const mockReports = [
        { id: 1, distance: 5 },
        { id: 2, distance: 8 }
      ];

      db.query.mockResolvedValue({
        rows: mockReports
      });

      const result = await ReportModel.getReportsNearLocation(-6.2088, 106.8456, 10);
      expect(result).toEqual(mockReports);
      expect(db.query).toHaveBeenCalledWith(
        expect.objectContaining({
          text: expect.stringContaining('SELECT'),
          values: [-6.2088, 106.8456, 10]
        })
      );
    });
  });

});