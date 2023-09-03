const getLatLonFromZip = require("./locationIQ");

// Example usage:
(async function () {
  const coordinates = await getLatLonFromZip("80816");
  console.log(coordinates);
})();
