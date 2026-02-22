import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-page">
      <form class="auth-card" (ngSubmit)="submit()">
        <h1>{{ isRegisterMode ? 'Créer un compte' : 'Connexion' }}</h1>

        <label>Email</label>
        <input type="email" [(ngModel)]="email" name="email" required />

        <label>Mot de passe</label>
        <input type="password" [(ngModel)]="password" name="password" required minlength="6" />

        <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>

        <button type="submit" [disabled]="loading">
          {{ loading ? 'Chargement...' : (isRegisterMode ? 'Créer le compte' : 'Se connecter') }}
        </button>

        <button type="button" class="link" (click)="toggleMode()">
          {{ isRegisterMode ? 'J\'ai déjà un compte' : 'Créer un nouveau compte' }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: var(--app-bg);
      padding: 1rem;
    }

    .auth-card {
      width: min(420px, 100%);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.25rem;
      display: grid;
      gap: 0.75rem;
    }

    h1 {
      margin: 0 0 0.25rem;
      font-size: 1.3rem;
    }

    label {
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    input {
      width: 100%;
      padding: 0.65rem;
      border: 1px solid var(--border);
      border-radius: 10px;
      background: #fff;
    }

    button {
      padding: 0.7rem 0.9rem;
      border: 0;
      border-radius: 10px;
      cursor: pointer;
      background: #1f4ed8;
      color: #fff;
      font-weight: 600;
    }

    .link {
      background: transparent;
      color: var(--text-muted);
      text-decoration: underline;
      padding: 0;
      justify-self: start;
    }

    .error {
      margin: 0;
      color: #b91c1c;
      font-size: 0.9rem;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  isRegisterMode = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = '';
  }

  submit(): void {
    this.errorMessage = '';
    this.loading = true;

    const request$ = this.isRegisterMode
      ? this.authService.register(this.email, this.password)
      : this.authService.login(this.email, this.password);

    request$.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.error ?? 'Erreur d\'authentification.';
      }
    });
  }
}
