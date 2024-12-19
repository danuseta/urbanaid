import { hashId, unhashId } from '../../src/utils/hash-util';

describe('Hash Utilities', () => {
  describe('hashId', () => {
    test('should create valid hash format', () => {
      const id = 123;
      const hashedId = hashId(id);
      
      expect(hashedId).toMatch(/^ua\d+x\d+$/);
      expect(hashedId.startsWith('ua')).toBe(true);
      expect(hashedId).toContain('x');
    });

    test('should handle invalid input by returning a hash with "null"', () => {
      const hashedId = hashId(null);
      expect(hashedId).toMatch(/^uanullx\d+$/);
    });

    test('should handle undefined input', () => {
      const hashedId = hashId(undefined);
      expect(hashedId).toMatch(/^uaundefinedx\d+$/);
    });
  });

  describe('unhashId', () => {
    test('should correctly unhash valid ID', () => {
      const originalId = 123;
      const hashedId = `ua${originalId}x${Date.now()}`;
      const unhashedId = unhashId(hashedId);
      
      expect(unhashedId).toBe(originalId);
    });

    test('should return null for invalid hash format', () => {
      const invalidHashes = ['invalid', 'xx123x456'];
      
      invalidHashes.forEach(hash => {
        expect(unhashId(hash)).toBeNull();
      });
    });

    test('should return null for non-string input', () => {
      const invalidInputs = [null, undefined, 123, {}, []];
      
      invalidInputs.forEach(input => {
        expect(unhashId(input)).toBeNull();
      });
    });

    test('should handle hash without timestamp', () => {
      const hashedId = 'ua123';
      expect(unhashId(hashedId)).toBe(123);
    });
  });
});