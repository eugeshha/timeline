export function parseCoordinates(input) {
  if (!input || typeof input !== "string") {
    throw new Error("Invalid input format");
  }

  const trimmed = input.trim();

  let cleaned = trimmed;
  if (cleaned.startsWith("[") && cleaned.endsWith("]")) {
    cleaned = cleaned.slice(1, -1).trim();
  }

  const parts = cleaned.split(",");
  if (parts.length !== 2) {
    throw new Error("Invalid input format");
  }

  const latStr = parts[0].trim().replace(/[\u2212\u2013\u2014]/g, "-");
  const lonStr = parts[1].trim().replace(/[\u2212\u2013\u2014]/g, "-");

  const latitude = parseFloat(latStr);
  const longitude = parseFloat(lonStr);

  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error("Invalid input format");
  }

  if (latitude < -90 || latitude > 90) {
    throw new Error("Latitude must be between -90 and 90");
  }

  if (longitude < -180 || longitude > 180) {
    throw new Error("Longitude must be between -180 and 180");
  }

  return {
    latitude,
    longitude,
  };
}
