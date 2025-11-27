const AppError = require(`../utils/appError`);
const axios = require(`axios`);

const locationCache = new Map();

exports.geoPostcode = async (location) => {
  try {
    const cleanLocation = location.trim();
    const cacheKey = cleanLocation.toLowerCase();

    if (locationCache.has(cacheKey)) {
      return locationCache.get(cacheKey);
    }

    // 1. Try as Postcode (UK)
    // Basic regex for UK postcode
    const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;

    if (postcodeRegex.test(cleanLocation)) {
      const postcode = cleanLocation.replace(/\s/g, ``);
      try {
        const response = await axios.get(
          `https://api.postcodes.io/postcodes/${postcode}`
        );
        if (response.data.status === 200) {
          const result = {
            type: `Point`,
            coordinates: [
              response.data.result.longitude,
              response.data.result.latitude,
            ],
          };
          locationCache.set(cacheKey, result);
          return result;
        }
      } catch (err) {
        // If postcode not found, continue to try as city
      }
    }

    // 2. Try as City/Place using Nominatim
    // Heuristic: If it looks like a partial postcode (e.g. "M1", "B1"), append " Postcode" to help Nominatim
    let query = cleanLocation;
    const partialPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]?$/i;
    if (partialPostcodeRegex.test(cleanLocation)) {
      // It's likely a postcode district (e.g. M1, B1, SW1)
      // Nominatim handles "M1" badly (thinks it's the motorway), but "M1 UK" or "M1 Postcode" might work better.
      // Actually, postcodes.io has an autocomplete/lookup for outcodes.
      try {
        const outcodeRes = await axios.get(
          `https://api.postcodes.io/outcodes/${cleanLocation}`
        );
        if (outcodeRes.data.status === 200) {
          const result = {
            type: `Point`,
            coordinates: [
              outcodeRes.data.result.longitude,
              outcodeRes.data.result.latitude,
            ],
          };
          locationCache.set(cacheKey, result);
          return result;
        }
      } catch (e) {
        // Ignore and fall through to Nominatim
      }
    }

    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: query,
          format: "json",
          countrycodes: "gb",
          limit: 1,
        },
        headers: {
          "User-Agent": "UKVisaSponsorship-JobBoard",
        },
      }
    );

    if (response.data && response.data.length > 0) {
      const result = {
        type: "Point",
        coordinates: [
          parseFloat(response.data[0].lon),
          parseFloat(response.data[0].lat),
        ],
      };
      locationCache.set(cacheKey, result);
      return result;
    }

    throw new AppError(`Location not found`, 404);
  } catch (err) {
    if (err.response?.status === 404 || err.message === "Location not found") {
      throw new AppError(`Location not found`, 404);
    }
    throw new AppError(`Invalid location`, 400);
  }
};
