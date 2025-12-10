import { parseCoordinates } from "./coordinates.js";

describe("parseCoordinates", () => {
  test("should parse coordinates with space", () => {
    const result = parseCoordinates("51.50851, −0.12572");
    expect(result).toEqual({
      latitude: 51.50851,
      longitude: -0.12572,
    });
  });

  test("should parse coordinates without space", () => {
    const result = parseCoordinates("51.50851,−0.12572");
    expect(result).toEqual({
      latitude: 51.50851,
      longitude: -0.12572,
    });
  });

  test("should parse coordinates with square brackets", () => {
    const result = parseCoordinates("[51.50851, −0.12572]");
    expect(result).toEqual({
      latitude: 51.50851,
      longitude: -0.12572,
    });
  });

  test("should parse coordinates with square brackets and no space", () => {
    const result = parseCoordinates("[51.50851,−0.12572]");
    expect(result).toEqual({
      latitude: 51.50851,
      longitude: -0.12572,
    });
  });

  test("should throw error for invalid format - missing comma", () => {
    expect(() => parseCoordinates("51.50851 −0.12572")).toThrow(
      "Invalid input format",
    );
  });

  test("should throw error for invalid format - too many parts", () => {
    expect(() => parseCoordinates("51.50851, −0.12572, 0")).toThrow(
      "Invalid input format",
    );
  });

  test("should throw error for non-numeric values", () => {
    expect(() => parseCoordinates("abc, def")).toThrow("Invalid input format");
  });

  test("should throw error for latitude out of range", () => {
    expect(() => parseCoordinates("91, 0")).toThrow(
      "Latitude must be between -90 and 90",
    );
  });

  test("should throw error for longitude out of range", () => {
    expect(() => parseCoordinates("0, 181")).toThrow(
      "Longitude must be between -180 and 180",
    );
  });

  test("should throw error for empty string", () => {
    expect(() => parseCoordinates("")).toThrow("Invalid input format");
  });

  test("should throw error for null", () => {
    expect(() => parseCoordinates(null)).toThrow("Invalid input format");
  });
});
