import { unhashId } from './hash-util.js';
const UrlParser = {
  parseActiveUrlWithCombiner() {
    const url = window.location.pathname.toLowerCase();
    const splitedUrl = this._urlSplitter(url);
    return this._urlCombiner(splitedUrl);
  },

  parseActiveUrlWithoutCombiner() {
    const url = window.location.pathname.toLowerCase();
    return this._urlSplitter(url);
  },

  _urlSplitter(url) {
    try {
      const urlsSplits = url.split('/');
      return {
        resource: this._sanitizeUrlPart(urlsSplits[1]) || null,
        id: this._sanitizeUrlPart(urlsSplits[2]) || null,
        verb: this._sanitizeUrlPart(urlsSplits[3]) || null,
        subResource: this._sanitizeUrlPart(urlsSplits[4]) || null,
        reportId: this._sanitizeUrlPart(urlsSplits[5]) || null,
      };
    } catch (error) {
      console.error('Error splitting URL:', error);
      return {
        resource: null,
        id: null,
        verb: null,
        subResource: null,
        reportId: null,
      };
    }
  },

  _urlCombiner(splitedUrl) {
    try {
      let combinedUrl = splitedUrl.resource ? `/${splitedUrl.resource}` : '/';

      if (splitedUrl.id) {
        combinedUrl += `/${splitedUrl.id}`;
      }

      if (splitedUrl.verb) {
        combinedUrl += `/${splitedUrl.verb}`;
      }

      if (splitedUrl.subResource) {
        combinedUrl += `/${splitedUrl.subResource}`;
      }

      if (splitedUrl.reportId) {
        combinedUrl += `/${splitedUrl.reportId}`;
      }

      return combinedUrl;
    } catch (error) {
      console.error('Error combining URL:', error);
      return '/';
    }
  },

  _sanitizeUrlPart(part) {
    if (!part) return null;
    return part.replace(/[^a-zA-Z0-9-_\.]/g, '');
  },

  getReportDetails() {
    const parsed = this.parseActiveUrlWithoutCombiner();
    if (parsed.resource !== 'pelaporan') return null;

    return {
      section: parsed.id || 'beranda',
      reportId: parsed.verb || null,
      action: parsed.subResource || null
    };
  },

  isReportPage() {
    const parsed = this.parseActiveUrlWithoutCombiner();
    return parsed.resource === 'pelaporan';
  },

  getDetailId() {
    try {
      const parsed = this.parseActiveUrlWithoutCombiner();
      if (parsed.resource === 'pelaporan' &&
                parsed.id === 'riwayat' &&
                parsed.verb) {
        console.log('Encoded ID from URL:', parsed.verb);
        const originalId = unhashId(parsed.verb);
        if (!originalId) {
          throw new Error('Failed to decode ID');
        }
        console.log('Decoded ID:', originalId);
        return originalId;
      }
      return null;
    } catch (error) {
      console.error('Error in getDetailId:', error);
      return null;
    }
  },

  isDetailPage() {
    const parsed = this.parseActiveUrlWithoutCombiner();
    return parsed.resource === 'pelaporan' &&
               parsed.id === 'riwayat' &&
               parsed.verb !== null;
  },

  getQueryParams() {
    const searchParams = new URLSearchParams(window.location.search);
    const params = {};

    for (const [key, value] of searchParams) {
      params[key] = value;
    }

    return params;
  },

  createUrlWithQuery(baseUrl, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  },
  getAdminDetailId() {
    try {
      const parsed = this.parseActiveUrlWithoutCombiner();
      if (parsed.resource === 'admin' &&
                parsed.id === 'laporan' &&
                parsed.verb) {
        console.log('Getting admin detail ID from URL:', parsed.verb);
        const originalId = unhashId(parsed.verb);
        if (!originalId) {
          throw new Error('Failed to decode admin detail ID');
        }
        console.log('Decoded admin ID:', originalId);
        return originalId;
      }
      return null;
    } catch (error) {
      console.error('Error in getAdminDetailId:', error);
      return null;
    }
  },

  isAdminDetailPage() {
    const parsed = this.parseActiveUrlWithoutCombiner();
    return parsed.resource === 'admin' &&
               parsed.id === 'laporan' &&
               parsed.verb !== null;
  },
  getRiwayatDetailId() {
    try {
        const parsed = this.parseActiveUrlWithoutCombiner();
        if (parsed.resource === 'admin' &&
            parsed.id === 'riwayat' &&
            parsed.verb) {
            console.log('Getting riwayat detail ID from URL:', parsed.verb);
            const originalId = unhashId(parsed.verb);
            if (!originalId) {
                throw new Error('Failed to decode riwayat detail ID');
            }
            console.log('Decoded riwayat ID:', originalId);
            return originalId;
        }
        return null;
    } catch (error) {
        console.error('Error in getRiwayatDetailId:', error);
        return null;
    }
},

  isRiwayatDetailPage() {
    const parsed = this.parseActiveUrlWithoutCombiner();
    return parsed.resource === 'admin' &&
               parsed.id === 'riwayat' &&
               parsed.verb !== null;
  }
};

export default UrlParser;
