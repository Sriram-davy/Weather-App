import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherBackgroundComponent } from './components/weather-background/weather-background.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { WeatherCardComponent } from './components/weather-card/weather-card.component';
import { WeatherService } from './services/weather.service';
import { LoggerService } from './services/logger.service';
import { WeatherData } from './models/weather.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    WeatherBackgroundComponent,
    SearchBarComponent,
    WeatherCardComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  currentWeather: WeatherData | null = null;
  isLoading: boolean = false;
  searchError: string | null = null;
  searchQuery: string = '';

  constructor(
    private weatherService: WeatherService,
    private cdr: ChangeDetectorRef,
    private logger: LoggerService
  ) { }

  async onSearch(cityName: string): Promise<void> {
    this.logger.debug('App: onSearch started for', cityName);
    if (!cityName.trim()) return;

    this.searchQuery = cityName;
    this.isLoading = true;
    this.searchError = null;
    this.currentWeather = null;
    this.cdr.detectChanges();

    try {
      this.logger.debug('App: Calling weatherService.getWeatherByCity...');
      const weather = await this.weatherService.getWeatherByCity(cityName);
      this.logger.debug('App: Received weather data:', weather);
      
      this.currentWeather = weather;
      this.cdr.detectChanges();
    } catch (error) {
      this.logger.error('App: Search error:', error);
      
      this.searchError = error instanceof Error ? error.message : 'Failed to fetch weather';
      this.cdr.detectChanges();
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
      this.logger.debug('App: onSearch finished. isLoading:', this.isLoading, 'currentWeather:', !!this.currentWeather);
    }
  }

  resetApp(): void {
    this.currentWeather = null;
    this.searchQuery = '';
    this.searchError = null;
  }
}
