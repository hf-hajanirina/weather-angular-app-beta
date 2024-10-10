import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkTheme = false;
  private themeSubject = new BehaviorSubject<boolean>(false);

  theme$ = this.themeSubject.asObservable();

  constructor() {
    this.initTheme();
  }

  initTheme() {
    this.darkTheme = localStorage.getItem('darkTheme') === 'true';
    this.setTheme(this.darkTheme);
  }

  isDarkTheme(): boolean {
    return this.darkTheme;
  }

  setTheme(isDarkTheme: boolean) {
    this.darkTheme = isDarkTheme;
    this.themeSubject.next(this.darkTheme);
    localStorage.setItem('darkTheme', this.darkTheme ? 'true' : 'false');
    if (this.darkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  toggleTheme() {
    this.setTheme(!this.darkTheme);
  }
}
