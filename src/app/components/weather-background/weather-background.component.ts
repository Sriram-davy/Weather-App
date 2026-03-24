import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather-background',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-background.component.html',
  styleUrl: './weather-background.component.scss'
})
export class WeatherBackgroundComponent implements OnInit, OnChanges, OnDestroy {
  @Input() weatherCondition: string | null = null;

  isLoaded = false;
  lightningStrike: 'left' | 'right' | null = null;
  isFlashing = false;
  private lightningInterval: any;

  // ── DEFAULT / initial particles ──────────────────────────────
  defaultParticles = Array.from({ length: 20 }, () => ({
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 5 + Math.random() * 5
  }));

  // ── CLEAR DAY — 25 shimmer particles ────────────────────────
  sunnyShimmer = Array.from({ length: 25 }, () => ({
    left: Math.random() * 100,
    delay: Math.random() * 6
  }));

  // ── CLEAR NIGHT — 80 stars, 3 drifting clouds ───────────────
  nightStars = Array.from({ length: 80 }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 80,
    delay: Math.random() * 6,
    duration: 2 + Math.random() * 4,
    size: 1 + Math.random() * 2.5
  }));
  nightClouds = Array.from({ length: 3 }, () => ({
    top: 10 + Math.random() * 30,
    duration: 50 + Math.random() * 20,
    delay: -Math.random() * 50,
    opacity: 0.2 + Math.random() * 0.2
  }));

  // ── PARTLY CLOUDY — 12 clouds in 3 depth layers ─────────────
  clouds = {
    layer1: Array.from({ length: 4 }, () => ({ top: 5 + Math.random() * 20, duration: 40 + Math.random() * 15, delay: -Math.random() * 40 })),
    layer2: Array.from({ length: 4 }, () => ({ top: 25 + Math.random() * 25, duration: 25 + Math.random() * 10, delay: -Math.random() * 25 })),
    layer3: Array.from({ length: 4 }, () => ({ top: 50 + Math.random() * 20, duration: 15 + Math.random() * 8,  delay: -Math.random() * 15 }))
  };

  // ── CLOUDY — 16 dark grey clouds ────────────────────────────
  darkClouds = Array.from({ length: 16 }, () => ({
    top: Math.random() * 60,
    duration: 35 + Math.random() * 20,
    delay: -Math.random() * 35,
    scale: 0.7 + Math.random() * 0.7
  }));

  // ── RAINY — 120 streaks, 6 ripples, 4 storm clouds ──────────
  rain = {
    heavy: Array.from({ length: 120 }, () => ({
      left: Math.random() * 110 - 5,
      delay: Math.random() * 1.5,
      duration: 0.3 + Math.random() * 0.2
    })),
    drizzle: Array.from({ length: 60 }, () => ({
      left: Math.random() * 110 - 5,
      delay: Math.random() * 2,
      duration: 0.9 + Math.random() * 0.4
    }))
  };
  ripples = Array.from({ length: 6 }, () => ({
    left: 5 + Math.random() * 90,
    delay: Math.random() * 1.5
  }));
  rainClouds = Array.from({ length: 4 }, () => ({
    top: Math.random() * 12,
    duration: 30 + Math.random() * 10,
    delay: -Math.random() * 30
  }));
  drizzleClouds = Array.from({ length: 2 }, () => ({
    top: Math.random() * 15,
    duration: 40 + Math.random() * 15,
    delay: -Math.random() * 40
  }));

  // ── SNOWY — 30 large / 40 medium / 50 fine ──────────────────
  snow = {
    large:  Array.from({ length: 30 }, () => ({ left: Math.random() * 100, delay: Math.random() * 6, duration: 5 + Math.random() * 3 })),
    medium: Array.from({ length: 40 }, () => ({ left: Math.random() * 100, delay: Math.random() * 7, duration: 7 + Math.random() * 4 })),
    fine:   Array.from({ length: 50 }, () => ({ left: Math.random() * 100, delay: Math.random() * 8, duration: 10 + Math.random() * 5 }))
  };

  // ── THUNDERSTORM — reuses rain.heavy + clouds ────────────────
  thunderClouds = Array.from({ length: 4 }, () => ({
    top: Math.random() * 15,
    duration: 30 + Math.random() * 10,
    delay: -Math.random() * 30
  }));

  // ── FOGGY — 6 fog banks ──────────────────────────────────────
  fogBanks = Array.from({ length: 6 }, (_, i) => ({
    top: 10 + i * 14,
    duration: 28 + i * 5,
    delay: -Math.random() * 20,
    direction: i % 2 === 0 ? 'left' : 'right'
  }));

  // ── WINDY — 10 streaks, 5 fast clouds, debris ────────────────
  windStreaks = Array.from({ length: 10 }, () => ({
    top: 5 + Math.random() * 90,
    delay: Math.random() * 3,
    duration: 1 + Math.random() * 1.5,
    width: 80 + Math.random() * 120
  }));
  windClouds = Array.from({ length: 5 }, () => ({
    top: 5 + Math.random() * 40,
    duration: 6 + Math.random() * 4,
    delay: -Math.random() * 8
  }));
  windDebris = Array.from({ length: 12 }, () => ({
    left: Math.random() * 100,
    top: 20 + Math.random() * 70,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 2,
    size: 3 + Math.random() * 6
  }));

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoaded = true;
      this.cdr.detectChanges();
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['weatherCondition']) {
      this.isLoaded = false;
      setTimeout(() => {
        this.isLoaded = true;
        this.cdr.detectChanges();
      }, 50);

      this.stopLightning();
      if (this.isThunderstorm()) {
        this.startLightning();
      }
    }
  }

  ngOnDestroy(): void {
    this.stopLightning();
  }

  // ── CSS class → background gradient + animation container ─────
  getWeatherClass(): string {
    if (!this.weatherCondition) return 'default';
    switch (this.weatherCondition) {
      case 'CLEAR_DAY':     return 'clear-day';
      case 'CLEAR_NIGHT':   return 'clear-night';
      case 'PARTLY_CLOUDY': return 'partly-cloudy';
      case 'CLOUDY':        return 'cloudy';
      case 'FOGGY':         return 'foggy';
      case 'DRIZZLE':       return 'drizzle';
      case 'RAINY':         return 'rainy';
      case 'SNOWY':         return 'snowy';
      case 'THUNDERSTORM':  return 'thunderstorm';
      case 'WINDY':         return 'windy';
      default:              return 'default';
    }
  }

  // ── Guards for *ngIf blocks ───────────────────────────────────
  isClearDay():     boolean { return this.weatherCondition === 'CLEAR_DAY'; }
  isClearNight():   boolean { return this.weatherCondition === 'CLEAR_NIGHT'; }
  isPartlyCloudy(): boolean { return this.weatherCondition === 'PARTLY_CLOUDY'; }
  isCloudy():       boolean { return this.weatherCondition === 'CLOUDY'; }
  isFoggy():        boolean { return this.weatherCondition === 'FOGGY'; }
  isDrizzle():      boolean { return this.weatherCondition === 'DRIZZLE'; }
  isRainy():        boolean { return this.weatherCondition === 'RAINY'; }
  isSnowy():        boolean { return this.weatherCondition === 'SNOWY'; }
  isThunderstorm(): boolean { return this.weatherCondition === 'THUNDERSTORM'; }
  isWindy():        boolean { return this.weatherCondition === 'WINDY'; }

  // ── Lightning logic ───────────────────────────────────────────
  private startLightning(): void {
    const strike = () => {
      this.lightningStrike = Math.random() > 0.5 ? 'left' : 'right';
      this.isFlashing = true;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.lightningStrike = null;
        this.isFlashing = false;
        this.cdr.detectChanges();
      }, 200);
      const nextDelay = 4000 + Math.random() * 3000;
      this.lightningInterval = setTimeout(strike, nextDelay);
    };
    this.lightningInterval = setTimeout(strike, 2000);
  }

  private stopLightning(): void {
    if (this.lightningInterval) {
      clearTimeout(this.lightningInterval);
      this.lightningInterval = null;
    }
    this.lightningStrike = null;
    this.isFlashing = false;
  }
}
