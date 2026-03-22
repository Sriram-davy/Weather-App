import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherData } from '../../models/weather.model';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="weather-card">
      <div class="weather-header">
        <h2 class="city-name">{{ weather.city }}, {{ weather.country }}</h2>
        <div class="weather-icon">{{ getWeatherIcon(weather.weatherCode) }}</div>
      </div>
      
      <div class="temperature-section">
        <div class="temperature">{{ weather.temperature }}°C</div>
        <div class="condition">{{ weather.condition }}</div>
      </div>
      
      <div class="weather-details">
        <div class="detail-item">
          <span class="detail-label">Humidity</span>
          <span class="detail-value">{{ weather.humidity }}%</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Wind Speed</span>
          <span class="detail-value">{{ weather.windSpeed }} km/h</span>
        </div>
      </div>
    </div>
  `,
  styleUrl: './weather-card.component.scss'
})
export class WeatherCardComponent {
  @Input() weather!: WeatherData;

  getWeatherIcon(weatherCode: number): string {
    const iconMap: { [key: number]: string } = {
      0: '☀️', // Clear Sky
      1: '⛅', // Partly Cloudy
      2: '⛅', // Partly Cloudy
      3: '⛅', // Partly Cloudy
      45: '🌫️', // Foggy
      48: '🌫️', // Foggy
      51: '🌧️', // Rainy
      53: '🌧️', // Rainy
      55: '🌧️', // Rainy
      61: '🌧️', // Rainy
      63: '🌧️', // Rainy
      65: '🌧️', // Rainy
      71: '❄️', // Snowy
      73: '❄️', // Snowy
      75: '❄️', // Snowy
      77: '❄️', // Snowy
      80: '🌧️', // Rainy
      81: '🌧️', // Rainy
      82: '🌧️', // Rainy
      95: '⛈️', // Thunderstorm
      96: '⛈️', // Thunderstorm
      99: '⛈️'  // Thunderstorm
    };

    return iconMap[weatherCode] || '🌤️';
  }
}
