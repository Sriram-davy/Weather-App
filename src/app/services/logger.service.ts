import { Injectable, isDevMode } from '@angular/core';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  // Default to DEBUG in development, ERROR in production, or configurable via environment
  private currentLevel: LogLevel = isDevMode() ? LogLevel.DEBUG : LogLevel.ERROR;

  setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  debug(message: string, ...optionalParams: any[]): void {
    if (this.currentLevel <= LogLevel.DEBUG) {
      console.log(`[DEBUG] ${message}`, ...optionalParams);
    }
  }

  info(message: string, ...optionalParams: any[]): void {
    if (this.currentLevel <= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, ...optionalParams);
    }
  }

  warn(message: string, ...optionalParams: any[]): void {
    if (this.currentLevel <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, ...optionalParams);
    }
  }

  error(message: string, ...optionalParams: any[]): void {
    if (this.currentLevel <= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, ...optionalParams);
    }
  }
}
