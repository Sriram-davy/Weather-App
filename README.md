# Weather App

A beautiful, animated weather application built with Angular 17 that displays real-time weather information with dynamic backgrounds based on weather conditions.

## Features

### 🌤️ Core Weather Features
- **Real-time Weather Data**: Fetches current weather information using OpenWeatherMap API
- **City Search**: Search for weather information by city name with autocomplete
- **Hourly Predictions**: 24-hour weather forecast with detailed predictions
- **Weather Metrics**: Temperature, humidity, UV index, wind speed, and more
- **Location Display**: Shows current location with weather-appropriate icons

### 🎨 Dynamic Animations
The app features beautiful animated backgrounds that change based on weather conditions:

- **☀️ Sunny**: Animated sun with green park background
- **🌧️ Rainy**: Falling rain animation with dark clouds
- **☁️ Cloudy**: Moving cloud layers
- **❄️ Snowy**: Falling snow particles
- **⛈️ Stormy**: Lightning effects with heavy rain
- **🌫️ Foggy**: Mist/fog overlay effects

### 🎯 UI/UX Features
- **Responsive Design**: Mobile-first approach that works on all devices
- **Glass Morphism**: Modern translucent UI elements
- **Smooth Transitions**: Weather-based theme changes with animations
- **Accessibility**: ARIA labels and keyboard navigation support
- **Modern UI**: Clean, intuitive interface with Angular Material components

## Technology Stack

### Frontend
- **Angular 17+**: Modern Angular with standalone components
- **TypeScript**: Type-safe JavaScript
- **SCSS**: Advanced styling with variables and mixins
- **Angular Material**: UI component library
- **RxJS**: Reactive programming for API calls

### API & Services
- **OpenWeatherMap API**: Real-time weather data
- **HTTP Client**: Angular's built-in HTTP service
- **Error Handling**: Comprehensive error management

### Animations
- **CSS3 Animations**: Hardware-accelerated animations
- **Angular Animations**: Component-based animation system
- **Weather-based Transitions**: Dynamic background switching

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── weather-display/
│   │   │   ├── weather-display.component.ts
│   │   │   ├── weather-display.component.html
│   │   │   └── weather-display.component.scss
│   │   ├── animated-background/
│   │   │   ├── animated-background.component.ts
│   │   │   ├── animated-background.component.html
│   │   │   └── animated-background.component.scss
│   │   ├── search-bar/
│   │   │   ├── search-bar.component.ts
│   │   │   ├── search-bar.component.html
│   │   │   └── search-bar.component.scss
│   │   └── hourly-forecast/
│   │       ├── hourly-forecast.component.ts
│   │       ├── hourly-forecast.component.html
│   │       └── hourly-forecast.component.scss
│   ├── services/
│   │   ├── weather.service.ts
│   │   └── weather.service.spec.ts
│   ├── models/
│   │   ├── weather.model.ts
│   │   └── forecast.model.ts
│   ├── utils/
│   │   ├── weather-animations.ts
│   │   └── weather-icons.ts
│   ├── app.ts
│   ├── app.html
│   ├── app.scss
│   ├── app.config.ts
│   └── app.routes.ts
├── assets/
│   ├── animations/
│   │   ├── rain.css
│   │   ├── snow.css
│   │   └── sunny.css
│   └── icons/
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
├── main.ts
├── index.html
└── styles.scss
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Angular CLI 17+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/weather-app.git
   cd weather-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Create an account at [OpenWeatherMap](https://openweathermap.org/api)
   - Get your free API key
   - Update `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiKey: 'YOUR_API_KEY_HERE'
   };
   ```

4. **Run the development server**
   ```bash
   ng serve
   ```

5. **Open your browser**
   Navigate to `http://localhost:4200`

## Usage

1. **Search for a city**: Use the search bar at the top to enter any city name
2. **View current weather**: See temperature, conditions, and weather metrics
3. **Check hourly forecast**: Scroll down to see 24-hour predictions
4. **Enjoy animations**: Background changes based on current weather conditions

## API Integration

### OpenWeatherMap API
The app uses the following OpenWeatherMap endpoints:
- **Current Weather**: `/weather` for current conditions
- **5 Day Forecast**: `/forecast` for hourly predictions
- **Geocoding**: `/geo/1.0/direct` for city search

### API Response Structure
```typescript
interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
}
```

## Animation System

### Weather-Based Backgrounds
Each weather condition has its own animation system:

```scss
// Rain animation
.rain {
  background: linear-gradient(to bottom, #616161 0%, #9bc5c3 100%);
  position: relative;
  overflow: hidden;
}

.rain::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('assets/rain.png') repeat;
  animation: rain 0.3s linear infinite;
}
```

### Animation Triggers
Animations are triggered based on weather conditions:
- Temperature ranges
- Weather descriptions
- Time of day
- Seasonal variations

## Testing

### Unit Tests
```bash
# Run unit tests
ng test

# Run tests with coverage
ng test --code-coverage
```

### E2E Tests
```bash
# Run end-to-end tests
ng e2e
```

### Manual Testing Checklist
- [ ] City search functionality
- [ ] Weather data display
- [ ] Background animations
- [ ] Responsive design
- [ ] Error handling
- [ ] Loading states

## Deployment

### Build for Production
```bash
ng build --prod
```

### Deploy to GitHub Pages
```bash
# Install angular-cli-ghpages
npm install -g angular-cli-ghpages

# Deploy to GitHub Pages
ng deploy --base-href=/weather-app/
```

### Deploy to Netlify
1. Build the project: `ng build --prod`
2. Upload the `dist/weather-app` folder to Netlify
3. Configure build settings:
   - Build command: `ng build --prod`
   - Publish directory: `dist/weather-app`

## Performance Optimization

### Lazy Loading
- Components are loaded on demand
- Background animations are optimized
- API calls are cached

### Bundle Optimization
- Tree shaking enabled
- AOT compilation
- Source maps excluded in production

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Code Style

This project follows:
- **Angular Style Guide**: Official Angular conventions
- **Prettier**: Code formatting
- **ESLint**: Code linting
- **Conventional Commits**: Commit message format

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **OpenWeatherMap**: For providing weather API
- **Angular Team**: For the amazing framework
- **Angular Material**: For beautiful UI components
- **Weather Icons**: For weather condition icons

## Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-username/weather-app/issues) page
2. Create a new issue with detailed information
3. Join our [Discord](https://discord.gg/weather-app) community

## Future Enhancements

- [ ] Weather alerts and notifications
- [ ] Multiple location support
- [ ] Weather history and trends
- [ ] Integration with weather satellites
- [ ] Voice search functionality
- [ ] Offline mode support
- [ ] Weather widgets for desktop
- [ ] Integration with smart home devices

---

**Made with ❤️ using Angular**
