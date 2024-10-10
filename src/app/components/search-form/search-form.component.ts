import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe, NgFor } from '@angular/common';
import { WeatherService } from '../../services/weather/weather.service';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [
    MatFormFieldModule, 
    MatInputModule, 
    MatAutocompleteModule, 
    ReactiveFormsModule,
    AsyncPipe,
    NgFor
  ],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss'
})
export class SearchFormComponent implements OnInit {
  @Output() search = new EventEmitter<string>();

  searchControl = new FormControl('');
  filteredOptions: Observable<string[]> = of([]);

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (value && typeof value === 'string' && value.length > 2) {
          return this.weatherService.searchCities(value).pipe(
            catchError(() => of([]))
          );
        } else {
          return of([]);
        }
      })
    );
  }

  onOptionSelected(event: any) {
    this.search.emit(event.option.value);
  }
}