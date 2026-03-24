// ============================================================
// SkyCast v2.0 — Extended Weather Model
// ============================================================

export interface WeatherData {
  // Core location
  city: string;
  country: string;
  fullLocationName: string; // e.g. "Mumbai, Maharashtra, India"

  // Temperature
  temperature: number;
  feelsLike: number;
  minTemp: number;
  maxTemp: number;

  // Conditions
  condition: string;        // e.g. "CLEAR_DAY", "RAINY"
  conditionLabel: string;   // e.g. "Clear Sky", "Heavy Rain"
  weatherCode: number;
  weatherIcon: string;
  isDay: boolean;

  // Atmosphere
  humidity: number;
  cloudCover: number;
  visibility: number;       // km
  pressure: number;         // hPa
  precipitation: number;    // mm

  // Wind
  windSpeed: number;        // km/h
  windGusts: number;        // km/h

  // UV
  uvIndex: number;
  uvLabel: string;

  // Sun
  sunrise: string;          // ISO time string
  sunset: string;           // ISO time string

  // Hourly forecast (next 12 hours)
  hourly: HourlyEntry[];
}

export interface HourlyEntry {
  time: string;             // ISO time string
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
  windSpeed: number;
  visibility: number;
  cloudCover: number;
}

export interface GeoLocationCandidate {
  name: string;
  country: string;
  admin1: string;   // state/region
  admin2: string;   // district
  latitude: number;
  longitude: number;
  population: number;
  displayName: string; // e.g. "Mumbai, Maharashtra, India"
}

// ============================================================
// Old interfaces preserved (commented out for reference)
// ============================================================

// OLD: export interface GeocodingResponse {
//   results: Array<{
//     name: string;
//     country: string;
//     latitude: number;
//     longitude: number;
//   }>;
// }
//
// OLD: export interface WeatherResponse {
//   current: {
//     temperature_2m: number;
//     relative_humidity_2m: number;
//     wind_speed_10m: number;
//     weather_code: number;
//   };
// }

// ============================================================
// New raw API response interfaces
// ============================================================

export interface GeocodingResponse {
  results: Array<{
    name: string;
    country: string;
    admin1?: string;
    admin2?: string;
    latitude: number;
    longitude: number;
    population?: number;
  }>;
}

export interface WeatherResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_gusts_10m: number;
    weather_code: number;
    cloud_cover: number;
    precipitation: number;
    snowfall: number;
    rain: number;
    visibility: number;
    apparent_temperature: number;
    is_day: number;          // 1 = day, 0 = night
    surface_pressure: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability: number[];
    wind_speed_10m: number[];
    visibility: number[];
    cloud_cover: number[];
  };
  daily: {
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
  };
}
