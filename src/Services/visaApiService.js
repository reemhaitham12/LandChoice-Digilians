import axios from 'axios';

/**
 * Service for integrating with Travel Buddy AI Visa Requirement API
 * Provides real-time visa intelligence from 200+ passports and 211 destinations
 */
class VisaApiService {
  constructor() {
    this.baseURL = 'https://visa-requirement.p.rapidapi.com';
    this.apiKey = import.meta.env.VITE_RAPIDAPI_KEY || '';
    this.apiHost = 'visa-requirement.p.rapidapi.com';

    // Cache for API responses (15 minutes)
    this.cache = new Map();
    this.cacheDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
  }


  getCached(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.cacheDuration;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Set cache data
   */
  setCached(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Check visa requirements for a specific passport and destination
   * @param {string} passportCode - ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB')
   * @param {string} destinationCode - ISO 3166-1 alpha-2 country code (e.g., 'PT', 'ES')
   * @returns {Promise<Object>} Visa requirement data
   */
  async checkVisaRequirement(passportCode, destinationCode) {
    const cacheKey = `visa_${passportCode}_${destinationCode}`;
    const cached = this.getCached(cacheKey);

    if (cached) {
      return cached;
    }

    if (!this.apiKey) {
      console.warn('VITE_RAPIDAPI_KEY not configured. Using mock data.');
      return this.getMockVisaData(passportCode, destinationCode);
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/v2/visa/check`,
        {
          passport: passportCode.toUpperCase(),
          destination: destinationCode.toUpperCase()
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-key': this.apiKey,
            'x-rapidapi-host': this.apiHost
          }
        }
      );

      const visaData = this.parseVisaResponse(response.data);
      this.setCached(cacheKey, visaData);

      return visaData;
    } catch (error) {
      console.error('Error fetching visa requirement:', error.message);

      // Fallback to mock data on error
      return this.getMockVisaData(passportCode, destinationCode);
    }
  }

  /**
   * Parse Travel Buddy AI API response
   */
  parseVisaResponse(apiResponse) {
    const data = apiResponse.data || apiResponse;

    return {
      passport: data.passport || {},
      destination: data.destination || {},
      visaRules: {
        primaryRule: data.visa_rules?.primary_rule || {},
        secondaryRules: data.visa_rules?.secondary_rules || [],
        exceptions: data.visa_rules?.exceptions || []
      },
      mandatoryRegistration: data.mandatory_registration || null,
      passportValidity: data.passport_validity || {},
      additionalInfo: data.additional_info || {},
      requiresVisa: data.visa_rules?.primary_rule?.color !== 'green',
      visaFree: data.visa_rules?.primary_rule?.color === 'green',
      visaOnArrival: data.visa_rules?.primary_rule?.name?.toLowerCase().includes('arrival'),
      eVisa: data.visa_rules?.primary_rule?.name?.toLowerCase().includes('e-visa'),
      embassyURL: data.destination?.embassy_url || null,
      population: data.destination?.population || null,
      area: data.destination?.area || null,
      currency: data.destination?.currency || null
    };
  }

  /**
   * Get multiple country visa requirements in batch
   * @param {string} passportCode - ISO 3166-1 alpha-2 country code
   * @param {Array<string>} destinationCodes - Array of destination country codes
   * @returns {Promise<Array>} Array of visa requirement data
   */
  async batchCheckVisaRequirements(passportCode, destinationCodes) {
    const promises = destinationCodes.map(destCode =>
      this.checkVisaRequirement(passportCode, destCode)
    );

    try {
      return await Promise.all(promises);
    } catch (error) {
      console.error('Error in batch visa check:', error.message);
      return [];
    }
  }

  /**
   * Mock data for development/fallback
   */
  getMockVisaData(passportCode, destinationCode) {
    const mockDatabase = {
      'US_PT': {
        passport: { code: 'US', name: 'United States' },
        destination: { code: 'PT', name: 'Portugal' },
        visaRules: {
          primaryRule: {
            name: 'Visa Required',
            color: 'red',
            duration: 'Visa Required for stays over 90 days'
          },
          secondaryRules: [],
          exceptions: []
        },
        requiresVisa: true,
        visaFree: false,
        visaOnArrival: false,
        eVisa: false,
        embassyURL: 'https://www.portugalglobal.pt'
      },
      'US_ES': {
        passport: { code: 'US', name: 'United States' },
        destination: { code: 'ES', name: 'Spain' },
        visaRules: {
          primaryRule: {
            name: 'Visa Required',
            color: 'red',
            duration: 'Visa Required for stays over 90 days'
          }
        },
        requiresVisa: true,
        visaFree: false
      }
    };

    const key = `${passportCode}_${destinationCode}`.toUpperCase();
    return mockDatabase[key] || {
      passport: { code: passportCode },
      destination: { code: destinationCode },
      visaRules: {
        primaryRule: {
          name: 'Unknown',
          color: 'gray',
          duration: 'Please check with embassy'
        }
      },
      requiresVisa: true
    };
  }

  /**
   * Get country information
   * @param {string} countryCode - ISO 3166-1 alpha-2 country code
   * @returns {Promise<Object>} Country information
   */
  async getCountryInfo(countryCode) {
    // This would use a separate API endpoint if available
    // For now, return basic info
    return {
      code: countryCode,
      // Additional info would come from API
    };
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache.clear();
  }
}

export default new VisaApiService();
