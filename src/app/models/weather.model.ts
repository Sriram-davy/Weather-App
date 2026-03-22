export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  weatherCode: number;
}

export interface GeocodingResponse {
  results: Array<{
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  }>;
}

export interface WeatherResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
}
