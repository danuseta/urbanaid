jest.mock('../../src/config/database.js', () => ({
  query: jest.fn(),
  connect: jest.fn()
}));

jest.mock('../../src/utils/db-utils.js', () => ({
  getNextAvailableId: jest.fn()
}));

const db = require('../../src/config/database.js');
const dbUtils = require('../../src/utils/db-utils.js');
const RiwayatModel = require('../../src/models/riwayatModel.js');

describe('RiwayatModel', () => {
  let mockClient;

  beforeEach(() => {
    jest.clearAllMocks();
    mockClient = {
      query: jest.fn(),
      release: jest.fn(),
      connect: jest.fn()
    };
    db.connect.mockResolvedValue(mockClient);
  });

  describe('getRiwayatByUserId', () => {
    test('should get user riwayat successfully', async () => {
      const mockRiwayat = [
        { id: 1, judul: 'Laporan 1' },
        { id: 2, judul: 'Laporan 2' }
      ];

      db.query.mockResolvedValue({ rows: mockRiwayat });

      const result = await RiwayatModel.getRiwayatByUserId(1);

      expect(result).toEqual(mockRiwayat);
      expect(db.query).toHaveBeenCalledWith(
        expect.objectContaining({
          text: expect.stringContaining('SELECT * FROM riwayat_laporan'),
          values: [1]
        })
      );
    });
  });

  describe('createRiwayat', () => {
    test('should create riwayat successfully', async () => {
      const mockRiwayatData = {
        judul: 'Test Riwayat',
        jenis_infrastruktur: 'Jalan',
        deskripsi: 'Test Description',
        tanggal_kejadian: new Date(),
        tanggal_selesai: new Date(),
        alamat: 'Test Address',
        status: 'diterima',
        keterangan_laporan: 'Test Keterangan',
        bukti_lampiran: 'test.jpg',
        user_id: 1
      };

      const mockNextId = 1;
      dbUtils.getNextAvailableId.mockResolvedValue(mockNextId);

      const mockDbResponse = {
        rows: [{
          id: mockNextId,
          ...mockRiwayatData
        }]
      };
      db.query.mockResolvedValue(mockDbResponse);

      const result = await RiwayatModel.createRiwayat(mockRiwayatData);

      expect(result).toEqual(mockDbResponse.rows[0]);
      expect(db.query).toHaveBeenCalledWith(
        expect.objectContaining({
          text: expect.stringContaining('INSERT INTO riwayat_laporan'),
          values: expect.arrayContaining([mockNextId])
        })
      );
    });
  });

  describe('transferToRiwayat', () => {
    test('should transfer report to riwayat successfully', async () => {
      const mockReport = {
        id: 1,
        judul: 'Test Report',
        jenis_infrastruktur: 'Jalan',
        deskripsi: 'Test Description',
        tanggal_kejadian: new Date(),
        alamat: 'Test Address',
        bukti_lampiran: 'test.jpg',
        user_id: 1,
        latitude: -6.123,
        longitude: 106.456
      };

      dbUtils.getNextAvailableId.mockResolvedValue(2);

      mockClient.query
        .mockImplementationOnce(() => Promise.resolve()) 
        .mockImplementationOnce(() => Promise.resolve({ rows: [mockReport] })) 
        .mockImplementationOnce(() => Promise.resolve({ 
          rows: [{
            ...mockReport,
            id: 2,
            status: 'diterima',
            keterangan_laporan: 'Test keterangan',
            tanggal_selesai: expect.any(Date)
          }]
        }))
        .mockImplementationOnce(() => Promise.resolve()) 
        .mockImplementationOnce(() => Promise.resolve()); 

      const result = await RiwayatModel.transferToRiwayat(1, 'diterima', 'Test keterangan');

      expect(result).toEqual(expect.objectContaining({
        id: 2,
        judul: mockReport.judul,
        status: 'diterima',
        keterangan_laporan: 'Test keterangan'
      }));

      expect(mockClient.query).toHaveBeenNthCalledWith(1, 'BEGIN');
      expect(mockClient.query).toHaveBeenNthCalledWith(2, {
        text: expect.stringContaining('SELECT * FROM laporan_masuk'),
        values: [1]
      });
      expect(mockClient.query).toHaveBeenNthCalledWith(3, {
        text: expect.stringContaining('INSERT INTO riwayat_laporan'),
        values: expect.arrayContaining([2])
      });
      expect(mockClient.query).toHaveBeenNthCalledWith(4, {
        text: expect.stringContaining('DELETE FROM laporan_masuk'),
        values: [1]
      });
      expect(mockClient.query).toHaveBeenNthCalledWith(5, 'COMMIT');
      expect(mockClient.release).toHaveBeenCalled();
    });

    test('should rollback transaction on error', async () => {
      mockClient.query
        .mockImplementationOnce(() => Promise.resolve())  
        .mockImplementationOnce(() => Promise.reject(new Error('Database error'))); 

      await expect(
        RiwayatModel.transferToRiwayat(1, 'diterima', 'Test keterangan')
      ).rejects.toThrow('Database error');

      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('getRiwayatWithUserDetails', () => {
    test('should get riwayat with user details successfully', async () => {
      const mockRiwayat = {
        id: 1,
        judul: 'Test Riwayat',
        nama_pelapor: 'Test User',
        email_pelapor: 'test@example.com'
      };

      db.query.mockResolvedValue({ rows: [mockRiwayat] });

      const result = await RiwayatModel.getRiwayatWithUserDetails(1);

      expect(result).toEqual(mockRiwayat);
      
      expect(db.query).toHaveBeenCalledWith({
        text: expect.stringMatching(/SELECT\s+r\.\*,\s+u\.nama\s+as\s+nama_pelapor,\s+u\.email\s+as\s+email_pelapor\s+FROM\s+riwayat_laporan\s+r\s+JOIN\s+users\s+u\s+ON\s+r\.user_id\s+=\s+u\.id\s+WHERE\s+r\.id\s+=\s+\$1/),
        values: [1]
      });
    });
  });
});