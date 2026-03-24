import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherBackgroundComponent } from './components/weather-background/weather-background.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { WeatherCardComponent } from './components/weather-card/weather-card.component';
import { WeatherService } from './services/weather.service';
import { LoggerService } from './services/logger.service';
import { WeatherData, GeoLocationCandidate } from './models/weather.model';

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
  // ============================================================
  // SkyCast v2.0 — State
  // ============================================================
  currentWeather: WeatherData | null = null;
  isLoading: boolean = false;
  searchError: string | null = null;

  // Multi-result location picker
  locationCandidates: GeoLocationCandidate[] = [];

  // Dev test panel — override condition for visual testing
  conditionOverride: string | null = null;
  devPanelOpen: boolean = false;
  readonly allConditions = [
    { key: 'CLEAR_DAY',     label: '☀️ Clear Day' },
    { key: 'CLEAR_NIGHT',   label: '🌙 Clear Night' },
    { key: 'PARTLY_CLOUDY', label: '⛅ Partly Cloudy' },
    { key: 'CLOUDY',        label: '☁️ Cloudy' },
    { key: 'FOGGY',         label: '🌫️ Foggy' },
    { key: 'DRIZZLE',       label: '🌦️ Drizzle' },
    { key: 'RAINY',         label: '🌧️ Rainy' },
    { key: 'SNOWY',         label: '❄️ Snowy' },
    { key: 'THUNDERSTORM',  label: '⛈️ Thunderstorm' },
    { key: 'WINDY',         label: '💨 Windy' }
  ];

  constructor(
    private weatherService: WeatherService,
    private cdr: ChangeDetectorRef,
    private logger: LoggerService
  ) { }

  // ============================================================
  // Background condition — override takes priority in dev mode
  // ============================================================
  get activeCondition(): string | null {
    if (this.conditionOverride) return this.conditionOverride;
    return this.currentWeather?.condition ?? null;
  }

  // ============================================================
  // Search — returns candidates for user to pick if >1 result
  // ============================================================
  async onSearch(cityName: string): Promise<void> {
    this.logger.debug('App v2: onSearch started for', cityName);
    if (!cityName.trim()) return;

    this.isLoading = true;
    this.searchError = null;
    this.currentWeather = null;
    this.locationCandidates = [];
    this.cdr.detectChanges();

    try {
      const candidates = await this.weatherService.searchLocation(cityName);

      if (candidates.length === 1) {
        // Auto-select if only one result
        await this.loadWeatherForCandidate(candidates[0]);
      } else {
        // Show picker
        this.locationCandidates = candidates;
        this.logger.debug('App v2: Multiple candidates found:', candidates.length);
      }
    } catch (error) {
      this.logger.error('App v2: Search error:', error);
      this.searchError = error instanceof Error ? error.message : 'Failed to fetch weather. Please try again.';
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  async selectLocation(candidate: GeoLocationCandidate): Promise<void> {
    this.isLoading = true;
    this.locationCandidates = [];
    this.searchError = null;
    this.cdr.detectChanges();

    try {
      await this.loadWeatherForCandidate(candidate);
    } catch (error) {
      this.searchError = error instanceof Error ? error.message : 'Failed to fetch weather.';
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  private async loadWeatherForCandidate(candidate: GeoLocationCandidate): Promise<void> {
    try {
      const weather = await this.weatherService.getWeatherForCandidate(candidate);
      this.logger.debug('App v2: Received WeatherData:', weather);
      this.currentWeather = weather;
    } catch (err) {
      this.searchError = err instanceof Error ? err.message : 'Error loading weather';
    } finally {
      this.cdr.detectChanges();
    }
  }

  // ============================================================
  // Dev panel
  // ============================================================
  setConditionOverride(condition: string): void {
    this.conditionOverride = condition;
    this.cdr.detectChanges();
  }

  clearConditionOverride(): void {
    this.conditionOverride = null;
    this.cdr.detectChanges();
  }

  toggleDevPanel(): void {
    this.devPanelOpen = !this.devPanelOpen;
  }

  // ============================================================
  // Reset
  // ============================================================
  resetApp(): void {
    this.currentWeather = null;
    this.searchError = null;
    this.locationCandidates = [];
    this.conditionOverride = null;
  }

  formatPop(pop: number): string {
    if (pop >= 1_000_000) return (pop / 1_000_000).toFixed(1) + 'M';
    if (pop >= 1_000)     return (pop / 1_000).toFixed(0) + 'K';
    return pop.toString();
  }
}
