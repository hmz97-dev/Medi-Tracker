// home.component.ts
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="dashboard">
      <div class="header">
        <h1>🏥 Medi-Tracker</h1>
        <button class="logout" (click)="logout()">Déconnexion</button>
      </div>
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
      min-height: 100vh;
      padding: 2rem;
      background: var(--app-bg);
    }

    h1 {
      margin: 0;
      font-size: 1.8rem;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .logout {
      border: 1px solid var(--border);
      background: var(--surface);
      border-radius: 10px;
      padding: 0.5rem 0.8rem;
      cursor: pointer;
    }

    nav {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-top: 2rem;
    }

    .card {
      padding: 1.25rem;
      border: 1px solid var(--border);
      border-radius: 12px;
      background: var(--surface);
      text-decoration: none;
      color: var(--text);
      transition: transform 0.2s;
    }

    .card h2 {
      margin: 0 0 0.35rem;
      font-size: 1.1rem;
    }

    .card p {
      margin: 0;
      color: var(--text-muted);
      font-size: 0.95rem;
    }

    .card:hover {
      transform: translateY(-3px);
      border-color: #c8d8fa;
      box-shadow: 0 6px 20px rgba(35, 56, 191, 0.08);
    }
  `]
})
export class HomeComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}