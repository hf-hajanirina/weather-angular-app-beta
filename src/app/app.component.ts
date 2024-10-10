import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { ForecastListComponent } from './components/forecast-list/forecast-list.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { WeatherService } from './services/weather/weather.service';
import { ThemeService } from './services/theme/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    SearchFormComponent,
    ForecastListComponent,
    ThemeToggleComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private weatherService = inject(WeatherService);
  private themeService = inject(ThemeService);
  private snackBar = inject(MatSnackBar);

  weather: any;
  forecast: any[] = [];
  loading = false;
  isDarkTheme = false;

  constructor() {
    this.isDarkTheme = this.themeService.isDarkTheme();
  }

  handleSearch(query: string) {
    this.loading = true;
    this.weatherService.fetchWeather(query).subscribe({
      next: (data) => {
        this.weather = data;
        this.loading = false;
      },
      error: (error) => {
        this.showNotification('Error fetching weather data', 'error');
        this.loading = false;
      },
    });

    this.weatherService.fetchForecast(query).subscribe({
      next: (data) => {
        this.forecast = this.formatForecast(data);
      },
      error: (error) => {
        this.showNotification('Error fetching forecast data', 'error');
      },
    });
  }

  private formatForecast(data: any): any[] {
    const dailyForecasts: { [key: string]: any } = {};

    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().split('T')[0];

      if (!dailyForecasts[dateKey]) {
        dailyForecasts[dateKey] = {
          date: date.toLocaleDateString('en-US', { weekday: 'long' }),
          temperature: item.main.temp,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        };
      }
    });

    return Object.values(dailyForecasts).slice(0, 5);
  }

  private showNotification(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  onThemeToggled(isDark: boolean) {
    this.isDarkTheme = isDark;
    this.themeService.setTheme(isDark);
  }
}
