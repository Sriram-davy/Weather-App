import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="weather-background" [ngClass]="getBackgroundClass()">
      <!-- Clear Sky -->
      <div *ngIf="isClearSky()" class="sun-glow">
        <div class="sun-rays">
          <div class="sun-ray" style="transform: rotate(0deg)"></div>
          <div class="sun-ray" style="transform: rotate(45deg)"></div>
          <div class="sun-ray" style="transform: rotate(90deg)"></div>
          <div class="sun-ray" style="transform: rotate(135deg)"></div>
          <div class="sun-ray" style="transform: rotate(180deg)"></div>
          <div class="sun-ray" style="transform: rotate(225deg)"></div>
          <div class="sun-ray" style="transform: rotate(270deg)"></div>
          <div class="sun-ray" style="transform: rotate(315deg)"></div>
        </div>
      </div>
      
      <!-- Partly Cloudy -->
      <div *ngIf="isPartlyCloudy()" class="clouds">
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
        <div class="cloud cloud-3"></div>
        <div class="cloud cloud-4"></div>
      </div>
      
      <!-- Foggy -->
      <div *ngIf="isFoggy()" class="fog-layers">
        <div class="fog-layer fog-1"></div>
        <div class="fog-layer fog-2"></div>
        <div class="fog-layer fog-3"></div>
      </div>
      
      <!-- Rainy -->
      <div *ngIf="isRainy()" class="rain">
        <div class="rain-drops">
          <div *ngFor="let drop of rainDrops" class="rain-drop" [style]="getRainDropStyle(drop)"></div>
        </div>
      </div>
      
      <!-- Snowy -->
      <div *ngIf="isSnowy()" class="snow">
        <div class="snowflakes">
          <div *ngFor="let flake of snowflakes" class="snowflake" [style]="getSnowflakeStyle(flake)"></div>
        </div>
      </div>
      
      <!-- Thunderstorm -->
      <div *ngIf="isThunderstorm()" class="thunderstorm">
        <div class="lightning-flash" *ngIf="showLightning"></div>
        <div class="lightning-bolt" *ngIf="showBolt"></div>
        <div class="rain-drops">
          <div *ngFor="let drop of rainDrops" class="rain-drop" [style]="getRainDropStyle(drop)"></div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './weather-background.component.scss'
})
export class WeatherBackgroundComponent implements OnChanges {
  @Input() weatherCondition: string | null = null;
  
  rainDrops = Array.from({ length: 100 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 0.5 + Math.random() * 0.5,
    opacity: 0.3 + Math.random() * 0.7
  }));
  
  snowflakes = Array.from({ length: 50 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    size: 2 + Math.random() * 6,
    opacity: 0.4 + Math.random() * 0.6
  }));
  
  showLightning = false;
  showBolt = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['weatherCondition']) {
      this.triggerLightning();
    }
  }

  getBackgroundClass(): string {
    if (!this.weatherCondition) return 'clear-sky';
    
    const condition = this.weatherCondition.toLowerCase();
    
    if (condition.includes('clear')) return 'clear-sky';
    if (condition.includes('partly cloudy')) return 'partly-cloudy';
    if (condition.includes('foggy')) return 'foggy';
    if (condition.includes('rainy')) return 'rainy';
    if (condition.includes('snowy')) return 'snowy';
    if (condition.includes('thunderstorm')) return 'thunderstorm';
    
    return 'clear-sky';
  }

  isClearSky(): boolean {
    return this.weatherCondition?.toLowerCase().includes('clear') || false;
  }

  isPartlyCloudy(): boolean {
    return this.weatherCondition?.toLowerCase().includes('partly cloudy') || false;
  }

  isFoggy(): boolean {
    return this.weatherCondition?.toLowerCase().includes('foggy') || false;
  }

  isRainy(): boolean {
    return this.weatherCondition?.toLowerCase().includes('rainy') || false;
  }

  isSnowy(): boolean {
    return this.weatherCondition?.toLowerCase().includes('snowy') || false;
  }

  isThunderstorm(): boolean {
    return this.weatherCondition?.toLowerCase().includes('thunderstorm') || false;
  }

  getRainDropStyle(drop: any): string {
    return `
      left: ${drop.left}%;
      animation-delay: ${drop.delay}s;
      animation-duration: ${drop.duration}s;
      opacity: ${drop.opacity};
    `;
  }

  getSnowflakeStyle(flake: any): string {
    return `
      left: ${flake.left}%;
      animation-delay: ${flake.delay}s;
      animation-duration: ${flake.duration}s;
      width: ${flake.size}px;
      height: ${flake.size}px;
      opacity: ${flake.opacity};
    `;
  }

  private triggerLightning(): void {
    if (this.isThunderstorm()) {
      // Trigger lightning flash
      setTimeout(() => {
        this.showLightning = true;
        setTimeout(() => {
          this.showLightning = false;
        }, 200);
      }, 1000);

      // Trigger lightning bolt
      setTimeout(() => {
        this.showBolt = true;
        setTimeout(() => {
          this.showBolt = false;
        }, 200);
      }, 1200);

      // Continue periodic lightning
      setInterval(() => {
        this.showLightning = true;
        setTimeout(() => {
          this.showLightning = false;
        }, 200);

        setTimeout(() => {
          this.showBolt = true;
          setTimeout(() => {
            this.showBolt = false;
          }, 200);
        }, 200);
      }, 4000 + Math.random() * 3000);
    }
  }
}
