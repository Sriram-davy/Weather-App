# Weather App

A beautiful, animated weather application built with Angular 17 that displays real-time weather information with dynamic backgrounds based on weather conditions.

## Features

*   **Weather Search**: Get accurate, up-to-date weather data for global cities using Open-Meteo API.
*   **Dynamic Weather Backgrounds**: The application features bespoke, CSS-only animations for each weather condition to provide an immersive experience.
    *   ☀️ **Sunny**: Pulsing sun with rays and sky shimmer.
    *   ⛅ **Partly Cloudy**: Layered, gently moving puffy clouds.
    *   🌧️ **Rainy**: Heavy and light rain streaks, puddle ripples, and storm clouds.
    *   ❄️ **Snowy**: Multiple layers of falling snow accumulating on the ground.
    *   ⛈️ **Thunderstorm**: Lightning flashes, rain, and heavy storm clouds.
    *   🌫️ **Foggy**: Thick, drifting fog banks.
*   **Clean Architecture**: Built using decoupled Angular components and an injected `LoggerService` for structured logging.

## Tech Stack

*   **Framework**: Angular (Standalone Components)
*   **Styling**: SCSS (pure CSS keyframe animations, no external animation libraries)
*   **Data API**: Open-Meteo API for real-time weather and geocoding.
*   **Dependency Injection**: Structured services like `WeatherService` and configurable `LoggerService`.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/weather-app.git
    cd Weather-App
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm start
    ```
    The application will be available at `http://localhost:4200/`.

## Architecture Details

*   `AppComponent`: The root container, managing state and orchestrating components.
*   `SearchBarComponent`: Handles user input for city queries, emitting output events.
*   `WeatherCardComponent`: Displays the fetched weather details cleanly.
*   `WeatherBackgroundComponent`: Contains the complex SCSS and logic to render immersive background weather effects.
*   `LoggerService`: A configurable logging service that supports DEBUG, INFO, WARN, and ERROR levels.
*   `WeatherService`: Handles API communication with Open-Meteo, using `firstValueFrom` for robust asynchronous data fetching.
