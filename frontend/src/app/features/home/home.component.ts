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
        <a routerLink="/patient" class="card">
          <h2>👥 Profil Patients</h2>
          <p>Consulter les profils des patients</p>
        </a>
        
        <a routerLink="/doctors" class="card">
          <h2>👨‍⚕️ Profil Médecins</h2>
          <p>Consulter les profils des médecins</p>
        </a>
        
        <a routerLink="/rdv" class="card">
          <h2>📅 Calendrier RDV</h2>
          <p>Consulter le calendrier des rendez-vous</p>
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