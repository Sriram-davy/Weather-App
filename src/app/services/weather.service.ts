import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, map, catchError } from 'rxjs';
import { WeatherData, GeocodingResponse, WeatherResponse } from '../models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
  private readonly WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

  constructor(private http: HttpClient) {}

  async getWeatherByCity(cityName: string): Promise<WeatherData> {
    const coords = await this.getCoordinates(cityName);
    const weather = await this.getWeather(coords.latitude, coords.longitude);
    return this.mapWeatherResponse(weather, coords.name, coords.country);
  }

  private async getCoordinates(cityName: string): Promise<{ latitude: number; longitude: number; name: string; country: string }> {
    const url = `${this.GEOCODING_URL}?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
    
    try {
      const response = await this.http.get<GeocodingResponse>(url).toPromise();
      
      if (!response || response.results.length === 0) {
        throw new Error('City not found');
      }

      const result = response.results[0];
      return {
        latitude: result.latitude,
        longitude: result.longitude,
        name: result.name,
        country: result.country
      };
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        throw new Error('Failed to fetch location data');
      }
      throw error;
    }
  }

  private async getWeather(latitude: number, longitude: number): Promise<WeatherResponse> {
    const url = `${this.WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=celsius&wind_speed_unit=kmh`;
    
    try {
      const response = await this.http.get<WeatherResponse>(url).toPromise();
      
      if (!response || !response.current) {
        throw new Error('Weather data not available');
      }

      return response;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        throw new Error('Failed to fetch weather data');
      }
      throw error;
    }
  }

  private mapWeatherResponse(response: WeatherResponse, city: string, country: string): WeatherData {
    const { current } = response;
    
    return {
      city,
      country,
      temperature: Math.round(current.temperature_2m),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      condition: this.getWeatherCondition(current.weather_code),
      weatherCode: current.weather_code
    };
  }

  private getWeatherCondition(weatherCode: number): string {
    const weatherMap: { [key: number]: string } = {
      0: 'Clear Sky',
      1: 'Partly Cloudy',
      2: 'Partly Cloudy',
      3: 'Partly Cloudy',
      45: 'Foggy',
      48: 'Foggy',
      51: 'Rainy',
      53: 'Rainy',
      55: 'Rainy',
      61: 'Rainy',
      63: 'Rainy',
      65: 'Rainy',
      71: 'Snowy',
      73: 'Snowy',
      75: 'Snowy',
      77: 'Snowy',
      80: 'Rainy',
      81: 'Rainy',
      82: 'Rainy',
      95: 'Thunderstorm',
      96: 'Thunderstorm',
      99: 'Thunderstorm'
    };

    return weatherMap[weatherCode] || 'Unknown';
  }
}
