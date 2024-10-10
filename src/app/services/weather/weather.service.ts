import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = environment.openWeatherApiKey;
  private baseUrl = 'https://api.openweathermap.org/data/2.5';
  private geoUrl = 'https://api.openweathermap.org/geo/1.0';

  constructor(private http: HttpClient) {}

  searchCities(query: string): Observable<string[]> {
    return this.http.get<any[]>(`${this.geoUrl}/direct?q=${query}&limit=5&appid=${this.apiKey}`)
      .pipe(
        map(response => response.map(city => `${city.name}, ${city.country}`))
      );
  }

  fetchWeather(city: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/weather?q=${city}&units=metric&appid=${this.apiKey}`);
  }

  fetchForecast(city: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/forecast?q=${city}&units=metric&appid=${this.apiKey}`);
  }
}