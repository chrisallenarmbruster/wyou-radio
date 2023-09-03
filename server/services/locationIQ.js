const axios = require("axios");
require("dotenv").config();

const LOCATION_IQ_API_KEY = "pk.5b886a93cefe2fef951d9518e0b6a874"; //process.env.LOCATION_IQ_API_KEY; // Replace with your LocationIQ API key
const BASE_URL = "https://us1.locationiq.com/v1/search.php";

async function getLatLonFromZip(zipCode) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: zipCode,
        format: "json",
        key: LOCATION_IQ_API_KEY,
      },
    });

    const firstResult = response.data[0];
    if (!firstResult) {
      throw new Error("No results found for this zip code.");
    }

    return {
      latitude: firstResult.lat,
      longitude: firstResult.lon,
    };
  } catch (error) {
    console.error(`Failed to fetch coordinates: ${error.message}`);
    return null;
  }
}

module.exports = getLatLonFromZip;
