import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherBackgroundComponent } from './components/weather-background/weather-background.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { WeatherCardComponent } from './components/weather-card/weather-card.component';
import { WeatherService } from './services/weather.service';
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

  constructor(
    private weatherService: WeatherService,
    private cdr: ChangeDetectorRef
  ) {}

  async onSearch(cityName: string): Promise<void> {
    if (!cityName.trim()) return;

    this.isLoading = true;
    this.searchError = null;
    this.currentWeather = null;
    this.cdr.detectChanges(); // Force UI update for loading state

    try {
      const weather = await this.weatherService.getWeatherByCity(cityName);
      this.currentWeather = weather;
      this.cdr.detectChanges(); // Force UI update for weather data
    } catch (error) {
      this.searchError = error instanceof Error ? error.message : 'Failed to fetch weather';
      this.cdr.detectChanges(); // Force UI update for error state
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges(); // Force UI update for loading state
    }
  }
}
