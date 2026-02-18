// home.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="dashboard">
      <h1>🏥 Medi-Tracker</h1>
      <nav>
        <a routerLink="/patients" class="card">
          <h2>👥 Patients</h2>
          <p>Gérer les patients</p>
        </a>
        
        <a routerLink="/doctors" class="card">
          <h2>👨‍⚕️ Médecins</h2>
          <p>Gérer les médecins</p>
        </a>
        
        <a routerLink="/RDV" class="card">
          <h2>📅 Rendez-vous</h2>
          <p>Gérer les RDV</p>
        </a>
      </nav>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
    }
    nav {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }
    .card {
      padding: 2rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      text-decoration: none;
      color: inherit;
      transition: transform 0.2s;
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
  `]
})
export class HomeComponent {}