import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  isDark = false;

  ngOnInit(): void {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      this.isDark = saved === 'true';
    } else {
      this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    if (this.isDark) {
      document.documentElement.classList.add('dark-mode');
    }
  }

  toggleDark(): void {
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle('dark-mode', this.isDark);
    localStorage.setItem('darkMode', String(this.isDark));
  }
}
