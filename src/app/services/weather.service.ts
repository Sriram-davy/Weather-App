import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  WeatherData,
  HourlyEntry,
  GeoLocationCandidate,
  GeocodingResponse,
  WeatherResponse
} from '../models/weather.model';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  // ============================================================
  // SkyCast v2.0 — Open-Meteo API endpoints
  // ============================================================
  private readonly GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
  private readonly WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

  // All 10 condition constants
  static readonly CLEAR_DAY     = 'CLEAR_DAY';
  static readonly CLEAR_NIGHT   = 'CLEAR_NIGHT';
  static readonly PARTLY_CLOUDY = 'PARTLY_CLOUDY';
  static readonly CLOUDY        = 'CLOUDY';
  static readonly FOGGY         = 'FOGGY';
  static readonly DRIZZLE       = 'DRIZZLE';
  static readonly RAINY         = 'RAINY';
  static readonly SNOWY         = 'SNOWY';
  static readonly THUNDERSTORM  = 'THUNDERSTORM';
  static readonly WINDY         = 'WINDY';

  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) { }

  // ============================================================
  // PUBLIC — get up to 5 location candidates then weather
  // ============================================================

  /**
   * Returns candidates if >1 result found.
   * Caller should let user pick, then call getWeatherForCandidate().
   */
  async searchLocation(searchTerm: string): Promise<GeoLocationCandidate[]> {
    this.logger.debug('WeatherService v2: Searching location:', searchTerm);
    const candidates = await this.getLocationCandidates(searchTerm);
    this.logger.debug('WeatherService v2: Candidates:', candidates);
    return candidates;
  }

  async getWeatherForCandidate(candidate: GeoLocationCandidate): Promise<WeatherData> {
    this.logger.debug('WeatherService v2: Fetching weather for candidate:', candidate.displayName);
    const weather = await this.getWeatherData(candidate.latitude, candidate.longitude);
    this.logger.debug('WeatherService v2: Raw weather response:', weather);
    const mapped = this.mapWeatherResponse(weather, candidate);
    this.logger.debug('WeatherService v2: Mapped WeatherData:', mapped);
    return mapped;
  }

  // ============================================================
  // OLD API (preserved, commented out)
  // ============================================================
  // OLD: async getWeatherByCity(cityName: string): Promise<WeatherData> {
  //   const coords = await this.getCoordinates(cityName);
  //   const weather = await this.getWeather(coords.latitude, coords.longitude);
  //   return this.mapWeatherResponse(weather, coords.name, coords.country);
  // }
  //
  // OLD: private async getCoordinates(cityName: string) {
  //   const url = `${this.GEOCODING_URL}?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
  //   const response = await firstValueFrom(this.http.get<GeocodingResponse>(url));
  //   if (!response?.results?.length) throw new Error('City not found');
  //   const r = response.results[0];
  //   return { latitude: r.latitude, longitude: r.longitude, name: r.name, country: r.country };
  // }
  //
  // OLD: private async getWeather(lat: number, lon: number) {
  //   const url = `${this.WEATHER_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=celsius&wind_speed_unit=kmh`;
  //   const response = await firstValueFrom(this.http.get<WeatherResponse>(url));
  //   if (!response?.current) throw new Error('Weather data not available');
  //   return response;
  // }

  // ============================================================
  // PRIVATE — NEW geocoding (up to 5 results)
  // ============================================================
  private async getLocationCandidates(searchTerm: string): Promise<GeoLocationCandidate[]> {
    const url = `${this.GEOCODING_URL}?name=${encodeURIComponent(searchTerm)}&count=5&language=en&format=json`;

    try {
      const response = await firstValueFrom(this.http.get<GeocodingResponse>(url));

      if (!response?.results?.length) {
        throw new Error('Location not found. Try a village, city, state, or country name.');
      }

      return response.results.map(r => {
        const parts = [r.name, r.admin1, r.country].filter(p => p && p.trim());
        const displayName = [...new Set(parts)].join(', '); // deduplicate e.g. Norway, Norway
        return {
          name: r.name,
          country: r.country,
          admin1: r.admin1 || '',
          admin2: r.admin2 || '',
          latitude: r.latitude,
          longitude: r.longitude,
          population: r.population || 0,
          displayName
        };
      });
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 429) throw new Error('Too many requests. Please wait a moment.');
        throw new Error('Unable to connect. Check your internet connection.');
      }
      throw error;
    }
  }

  // ============================================================
  // PRIVATE — NEW weather fetch (all extended fields)
  // ============================================================
  private async getWeatherData(lat: number, lon: number): Promise<WeatherResponse> {
    const params = [
      `latitude=${lat}`,
      `longitude=${lon}`,
      `current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,weather_code,cloud_cover,precipitation,snowfall,rain,visibility,apparent_temperature,is_day,surface_pressure`,
      `hourly=temperature_2m,weather_code,precipitation_probability,wind_speed_10m,visibility,cloud_cover`,
      `daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset,uv_index_max`,
      `temperature_unit=celsius`,
      `wind_speed_unit=kmh`,
      `precipitation_unit=mm`,
      `timezone=auto`,
      `forecast_days=1`,
      `forecast_hours=12`
    ].join('&');

    const url = `${this.WEATHER_URL}?${params}`;

    try {
      const response = await firstValueFrom(this.http.get<WeatherResponse>(url));
      if (!response?.current) throw new Error('Weather data not available');
      return response;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 429) throw new Error('Too many requests. Please wait a moment.');
        throw new Error('Unable to connect. Check your internet connection.');
      }
      throw error;
    }
  }

  // ============================================================
  // PRIVATE — Map raw response → WeatherData
  // ============================================================
  private mapWeatherResponse(resp: WeatherResponse, candidate: GeoLocationCandidate): WeatherData {
    const c = resp.current;
    const daily = resp.daily;
    const hourly = resp.hourly;
    const isDay = c.is_day === 1;

    const condition = this.getWeatherCondition(c.weather_code, isDay, c.wind_speed_10m);
    const conditionLabel = this.getConditionLabel(condition);
    const weatherIcon = this.getWeatherIcon(c.weather_code, isDay);
    const uvIndex = daily?.uv_index_max?.[0] ?? 0;
    const uvLabel = this.getUvLabel(uvIndex);

    // Build hourly entries (up to 12)
    const hourlyEntries: HourlyEntry[] = [];
    const times = hourly?.time ?? [];
    const maxHours = Math.min(times.length, 12);
    for (let i = 0; i < maxHours; i++) {
      hourlyEntries.push({
        time: times[i],
        temperature: Math.round(hourly.temperature_2m[i]),
        weatherCode: hourly.weather_code[i],
        precipitationProbability: hourly.precipitation_probability?.[i] ?? 0,
        windSpeed: Math.round(hourly.wind_speed_10m[i]),
        visibility: Math.round((hourly.visibility?.[i] ?? 10000) / 1000),
        cloudCover: hourly.cloud_cover?.[i] ?? 0
      });
    }

    return {
      city: candidate.name,
      country: candidate.country,
      fullLocationName: candidate.displayName,
      temperature: Math.round(c.temperature_2m),
      feelsLike: Math.round(c.apparent_temperature),
      minTemp: Math.round(daily?.temperature_2m_min?.[0] ?? c.temperature_2m),
      maxTemp: Math.round(daily?.temperature_2m_max?.[0] ?? c.temperature_2m),
      condition,
      conditionLabel,
      weatherCode: c.weather_code,
      weatherIcon,
      isDay,
      humidity: c.relative_humidity_2m,
      cloudCover: c.cloud_cover,
      visibility: Math.round(c.visibility / 1000), // metres → km
      pressure: Math.round(c.surface_pressure),
      precipitation: c.precipitation,
      windSpeed: Math.round(c.wind_speed_10m),
      windGusts: Math.round(c.wind_gusts_10m),
      uvIndex,
      uvLabel,
      sunrise: daily?.sunrise?.[0] ?? '',
      sunset: daily?.sunset?.[0] ?? '',
      hourly: hourlyEntries
    };
  }

  // ============================================================
  // HELPERS — Condition mapping (WMO codes)
  // ============================================================

  /**
   * Returns one of 10 condition constants based on WMO code + is_day + wind speed.
   * WINDY takes priority only when wind > 50 km/h AND no severe weather.
   */
  getWeatherCondition(code: number, isDay: boolean, windSpeed: number): string {
    // Check WINDY first (overrides mild conditions only, not precip/thunder)
    const isSevere = [51,53,55,61,63,65,71,73,75,77,80,81,82,85,86,95,96,99].includes(code);
    if (windSpeed > 50 && !isSevere && code <= 3) return WeatherService.WINDY;

    if (code === 0) return isDay ? WeatherService.CLEAR_DAY : WeatherService.CLEAR_NIGHT;
    if (code === 1 || code === 2) return WeatherService.PARTLY_CLOUDY;
    if (code === 3) return WeatherService.CLOUDY;
    if (code === 45 || code === 48) return WeatherService.FOGGY;
    if (code === 51 || code === 53 || code === 55) return WeatherService.DRIZZLE;
    if ([61,63,65,80,81,82].includes(code)) return WeatherService.RAINY;
    if ([71,73,75,77,85,86].includes(code)) return WeatherService.SNOWY;
    if ([95,96,99].includes(code)) return WeatherService.THUNDERSTORM;

    // Fallback for unknown codes
    return isDay ? WeatherService.CLEAR_DAY : WeatherService.CLEAR_NIGHT;
  }

  getConditionLabel(condition: string): string {
    const labels: Record<string, string> = {
      [WeatherService.CLEAR_DAY]:     'Clear Sky',
      [WeatherService.CLEAR_NIGHT]:   'Clear Night',
      [WeatherService.PARTLY_CLOUDY]: 'Partly Cloudy',
      [WeatherService.CLOUDY]:        'Overcast',
      [WeatherService.FOGGY]:         'Foggy',
      [WeatherService.DRIZZLE]:       'Light Drizzle',
      [WeatherService.RAINY]:         'Rainy',
      [WeatherService.SNOWY]:         'Snowing',
      [WeatherService.THUNDERSTORM]:  'Thunderstorm',
      [WeatherService.WINDY]:         'Windy'
    };
    return labels[condition] ?? 'Unknown';
  }

  getWeatherIcon(code: number, isDay: boolean = true): string {
    if (code === 0) return isDay ? '☀️' : '🌙';
    if (code === 1 || code === 2) return '⛅';
    if (code === 3) return '☁️';
    if (code === 45 || code === 48) return '🌫️';
    if (code === 51 || code === 53 || code === 55) return '🌦️';
    if ([61,63,65,80,81,82].includes(code)) return '🌧️';
    if ([71,73,75,77,85,86].includes(code)) return '❄️';
    if ([95,96,99].includes(code)) return '⛈️';
    return '🌤️';
  }

  getUvLabel(uv: number): string {
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    if (uv <= 10) return 'Very High';
    return 'Extreme';
  }

  // ============================================================
  // OLD condition helper (preserved for reference)
  // ============================================================
  // private getWeatherCondition(weatherCode: number): string {
  //   const weatherMap: { [key: number]: string } = {
  //     0: 'Clear Sky', 1: 'Partly Cloudy', 2: 'Partly Cloudy', 3: 'Partly Cloudy',
  //     45: 'Foggy', 48: 'Foggy',
  //     51: 'Rainy', 53: 'Rainy', 55: 'Rainy',
  //     61: 'Rainy', 63: 'Rainy', 65: 'Rainy',
  //     71: 'Snowy', 73: 'Snowy', 75: 'Snowy', 77: 'Snowy',
  //     80: 'Rainy', 81: 'Rainy', 82: 'Rainy',
  //     95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm'
  //   };
  //   return weatherMap[weatherCode] || 'Unknown';
  // }
}
