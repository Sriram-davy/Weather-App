import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherData } from '../../models/weather.model';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-card.component.html',
  styleUrl: './weather-card.component.scss'
})
export class WeatherCardComponent {
  @Input() weather!: WeatherData;

  getHourlyIcon(code: number): string {
    return this.weatherService.getWeatherIcon(code, true);
  }

  getUvLabel(uv: number): string {
    return this.weatherService.getUvLabel(uv);
  }

  /** Format ISO datetime string → "6:30 AM" */
  formatTime(isoStr: string): string {
    if (!isoStr) return '—';
    try {
      const d = new Date(isoStr);
      return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch {
      return isoStr;
    }
  }

  /** Format ISO datetime string → "3 PM" */
  formatHour(isoStr: string): string {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
      return d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    } catch {
      return '';
    }
  }

  constructor(private weatherService: WeatherService) {}
}
