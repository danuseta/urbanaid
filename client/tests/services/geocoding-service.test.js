describe('GeocodingService', () => {
    let GeocodingService;
    let originalFetch;
  
    beforeEach(() => {
      originalFetch = global.fetch;
      global.fetch = jest.fn();
      
      GeocodingService = require('../../src/services/geocoding-service').default;
    });
  
    afterEach(() => {
      global.fetch = originalFetch;
      jest.clearAllMocks();
    });
  
    describe('getCoordinatesFromAddress', () => {
      test('should return coordinates for valid address', async () => {
        const mockResponse = [{
          lat: '-6.2088',
          lon: '106.8456',
          display_name: 'Jakarta, Indonesia'
        }];
  
        global.fetch.mockResolvedValueOnce({
          json: () => Promise.resolve(mockResponse)
        });
  
        const result = await GeocodingService.getCoordinatesFromAddress('Jakarta');
  
        expect(result).toEqual({
          latitude: -6.2088,
          longitude: 106.8456,
          displayName: 'Jakarta, Indonesia'
        });
      });
  
      test('should return null for non-existent address', async () => {
        global.fetch.mockResolvedValueOnce({
          json: () => Promise.resolve([])
        });
  
        const result = await GeocodingService.getCoordinatesFromAddress('NonExistentPlace123');
        expect(result).toBeNull();
      });
  
      test('should return null on API error', async () => {
        global.fetch.mockRejectedValueOnce(new Error('Network error'));
  
        const result = await GeocodingService.getCoordinatesFromAddress('Jakarta');
        expect(result).toBeNull();
      });
  
      test('should use correct URL and headers', async () => {
        global.fetch.mockResolvedValueOnce({
          json: () => Promise.resolve([])
        });
  
        await GeocodingService.getCoordinatesFromAddress('Jakarta');
  
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('https://nominatim.openstreetmap.org/search'),
          expect.objectContaining({
            headers: {
              'User-Agent': 'UrbanAid App'
            }
          })
        );
      });
    });
  });