import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  // Page d'accueil
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () => import('./features/auth/login').then(m => m.LoginComponent)
  },

  // Home
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  },

  // Route Patient (Lazy Loading)
  {
    path: 'patient',
    loadComponent: () => import('./features/patient/patient').then(m => m.Patient),
    canActivate: [authGuard]
  },

  // Doctors (Lazy Loading)
  {
    path: 'doctors',
    loadComponent: () =>
      import('./features/doctors/doctors').then(m => m.Doctors),
    canActivate: [authGuard]
  },

  // RDV (Lazy Loading) ✅ CORRIGÉ
  {
    path: 'rdv',
    loadComponent: () =>
      import('./features/rdv/rdv').then(m => m.RdvComponent),
    canActivate: [authGuard]
  },

  // 404
  {
    path: '**',
    redirectTo: '/login'
  }
];
