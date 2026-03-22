import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-bar">
      <div class="search-input-container">
        <input
          type="text"
          [(ngModel)]="searchQuery"
          (keyup.enter)="onSearch()"
          placeholder="Enter city name..."
          class="search-input"
          [disabled]="isLoading"
        />
        <button 
          (click)="onSearch()" 
          class="search-button"
          [disabled]="!searchQuery.trim() || isLoading"
        >
          <span class="search-icon">🔍</span>
        </button>
      </div>
      
      <div class="error-message" *ngIf="error">
        {{ error }}
      </div>
    </div>
  `,
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  @Input() isLoading: boolean = false;
  @Input() error: string | null = null;
  @Output() search = new EventEmitter<string>();

  searchQuery: string = '';

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.search.emit(this.searchQuery.trim());
    }
  }
}
