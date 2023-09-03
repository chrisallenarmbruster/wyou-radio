const axios = require("axios");

const OPEN_WEATHER_API_KEY = "f1fb4d33a97801827ee7e4daac5e59f1"; //process.env.OPEN_WEATHER_API_KEY;

const BASE_URL = "https://api.openweathermap.org/data/3.0/onecall/timemachine";

// latitude: '38.86003596296296', longitude: '-105.27348095555556' }

function toImperialAndLocalTime(data) {
  function kelvinToFahrenheit(K) {
    return ((K - 273.15) * 9) / 5 + 32;
  }

  function mpsToMph(mps) {
    return mps * 2.23694;
  }

  function unixToHumanTime(unix, offset) {
    const date = new Date((unix + offset) * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const imperialData = {
    lat: data.lat,
    lon: data.lon,
    timezone: data.timezone,
    timezone_offset: data.timezone_offset,
    data: data.data.map((item) => {
      return {
        dt: unixToHumanTime(item.dt, data.timezone_offset),
        sunrise: unixToHumanTime(item.sunrise, data.timezone_offset),
        sunset: unixToHumanTime(item.sunset, data.timezone_offset),
        temp: kelvinToFahrenheit(item.temp),
        feels_like: kelvinToFahrenheit(item.feels_like),
        pressure: item.pressure,
        humidity: item.humidity,
        dew_point: kelvinToFahrenheit(item.dew_point),
        uvi: item.uvi,
        clouds: item.clouds,
        visibility: (item.visibility / 1609.34).toFixed(2),
        wind_speed: mpsToMph(item.wind_speed),
        wind_deg: item.wind_deg,
        wind_gust: mpsToMph(item.wind_gust),
        weather: item.weather,
      };
    }),
  };

  return imperialData;
}

async function getWeatherForDate(lat, lon, dateTimestamp) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        lat: lat,
        lon: lon,
        dt: dateTimestamp,
        appid: OPEN_WEATHER_API_KEY,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Failed to fetch weather data: ${error.message}`);
    return null;
  }
}

async function createWeather() {
  const lat = 38.86003596296296;
  const lon = -105.27348095555556;
  const currentDateTimestamp = Math.floor(Date.now() / 1000);

  const weatherData = await getWeatherForDate(lat, lon, currentDateTimestamp);

  if (!weatherData) return null;

  // Extract necessary data for your segment
  const currentTemperature = weatherData.data[0].temp;
  const description = weatherData.data[0].description;

  // Formulate your message based on the fetched data
  const message = `The current temperature is ${currentTemperature}°C with ${description}.`;

  return weatherData;
}

function describeWeather(weatherData) {
  const {
    dt,
    temp,
    feels_like,
    sunrise,
    sunset,
    humidity,
    dew_point,
    pressure,
    uvi,
    clouds,
    visibility,
    wind_speed,
    wind_deg,
    wind_gust,
  } = weatherData.data[0];

  const mainDescription = weatherData.data[0].weather[0].main;
  const detailedDescription = weatherData.data[0].weather[0].description;
  // const formattedSunrise = formatTime(sunrise);
  // const formattedSunset = formatTime(sunset);
  const windDirectionCardinal = determineWindDirection(wind_deg);

  return `
  As of ${dt} today, the weather is described as ${mainDescription}, more specifically: ${detailedDescription}. 
  The temperature is currently ${Math.round(
    temp
  )} degrees, but it feels like ${Math.round(feels_like)}.
  The sun rose at ${sunrise} and will set at ${sunset}.
  Humidity stands at ${Math.round(
    humidity
  )} percent, with a dew point of ${Math.round(dew_point)} degrees.
  The ultraviolet index is currently at ${uvi}.
  The sky is ${clouds} percent cloudy, with a visibility of approximately ${Math.round(
    visibility
  )} miles.
  Winds are coming from the ${windDirectionCardinal} at ${wind_speed.toFixed(
    0
  )} mph, gusting up to ${wind_gust.toFixed(0)} mph.
  `.trim();
}

function determineWindDirection(degrees) {
  const cardinalDirections = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round((degrees % 360) / 45);
  return cardinalDirections[index % 8];
}

async function main() {
  const weatherData = toImperialAndLocalTime(await createWeather());
  const weatherDescription = describeWeather(weatherData);

  if (weatherData) {
    console.log(weatherDescription);
  } else {
    console.log("Failed to fetch weather data.");
  }
}

main();

// module.exports = createWeather;
// {
//   lat: 38.86,
//   lon: -105.2735,
//   timezone: "America/Denver",
//   timezone_offset: -21600,
//   data: [
//     {
//       dt: 1693695521,
//       sunrise: 1693657857,
//       sunset: 1693704669,
//       temp: 297.89,
//       feels_like: 297.1,
//       pressure: 1003,
//       humidity: 26,
//       dew_point: 277.11,
//       uvi: 1.83,
//       clouds: 99,
//       visibility: 10000,
//       wind_speed: 0.89,
//       wind_deg: 214,
//       wind_gust: 2.68,
//       weather: [
//         {
//           id: 804,
//           main: "Clouds",
//           description: "overcast clouds",
//           icon: "04d",
//         },
//       ],
//     },
//   ],
// }
