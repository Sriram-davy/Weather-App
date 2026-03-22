import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather-background',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-background.component.html',
  styleUrl: './weather-background.component.scss'
})
export class WeatherBackgroundComponent implements OnInit, OnChanges {
  @Input() weatherCondition: string | null = null;
  
  isLoaded = false;
  lightningStrike: 'left' | 'right' | null = null;
  isFlashing = false;
  private lightningInterval: any;

  // Step 7 Default
  defaultParticles = Array.from({ length: 20 }, () => ({
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 5 + Math.random() * 5
  }));

  // Step 1 Sunny
  sunnyShimmer = Array.from({ length: 30 }, () => ({
    left: Math.random() * 100,
    delay: Math.random() * 5
  }));

  // Step 2 Cloudy
  clouds = {
    layer1: Array.from({ length: 4 }, () => ({ top: 10 + Math.random() * 20, duration: 40 + Math.random() * 15, delay: -Math.random() * 40 })),
    layer2: Array.from({ length: 5 }, () => ({ top: 30 + Math.random() * 30, duration: 25 + Math.random() * 10, delay: -Math.random() * 25 })),
    layer3: Array.from({ length: 4 }, () => ({ top: 60 + Math.random() * 20, duration: 12 + Math.random() * 8, delay: -Math.random() * 12 }))
  };

  // Step 3 Rainy
  rain = {
    heavy: Array.from({ length: 100 }, () => ({ left: Math.random() * 100, delay: Math.random() * 2, duration: 0.3 + Math.random() * 0.3 })),
    light: Array.from({ length: 50 }, () => ({ left: Math.random() * 100, delay: Math.random() * 2, duration: 0.6 + Math.random() * 0.4 }))
  };
  ripples = Array.from({ length: 6 }, () => ({ left: Math.random() * 100, delay: Math.random() * 1.2 }));
  rainClouds = Array.from({ length: 3 }, () => ({ top: Math.random() * 10, duration: 30 + Math.random() * 10, delay: -Math.random() * 30 }));

  // Step 4 Snowy
  snow = {
    large: Array.from({ length: 25 }, () => ({ left: Math.random() * 100, delay: Math.random() * 5, duration: 5 + Math.random() * 3 })),
    medium: Array.from({ length: 35 }, () => ({ left: Math.random() * 100, delay: Math.random() * 5, duration: 7 + Math.random() * 4 })),
    fine: Array.from({ length: 40 }, () => ({ left: Math.random() * 100, delay: Math.random() * 5, duration: 10 + Math.random() * 5 }))
  };

  // Step 5 Thunderstorm
  thunderClouds = Array.from({ length: 4 }, () => ({ top: Math.random() * 15, duration: 30 + Math.random() * 10 }));

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Force set isLoaded to true on start to prevent white screen
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

  getWeatherClass(): string {
    if (!this.weatherCondition) return 'default';
    const condition = this.weatherCondition.toLowerCase();
    if (condition.includes('clear')) return 'sunny';
    if (condition.includes('cloudy')) return 'cloudy';
    if (condition.includes('rainy')) return 'rainy';
    if (condition.includes('snowy')) return 'snowy';
    if (condition.includes('thunderstorm')) return 'thunderstorm';
    if (condition.includes('foggy')) return 'foggy';
    return 'default';
  }

  isClearSky(): boolean { return this.weatherCondition?.toLowerCase().includes('clear') || false; }
  isPartlyCloudy(): boolean { return this.weatherCondition?.toLowerCase().includes('cloudy') || false; }
  isFoggy(): boolean { return this.weatherCondition?.toLowerCase().includes('foggy') || false; }
  isRainy(): boolean { return this.weatherCondition?.toLowerCase().includes('rainy') || false; }
  isSnowy(): boolean { return this.weatherCondition?.toLowerCase().includes('snowy') || false; }
  isThunderstorm(): boolean { return this.weatherCondition?.toLowerCase().includes('thunderstorm') || false; }

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

      const nextDelay = 3000 + Math.random() * 4000;
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
