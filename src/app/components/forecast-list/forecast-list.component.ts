import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-forecast-list',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './forecast-list.component.html',
  styleUrl: './forecast-list.component.scss'
})
export class ForecastListComponent {
  @Input() forecast: any[] = [];
}
