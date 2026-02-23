import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => import('./features/auth/login').then(m => m.LoginComponent),
  },

  { path: 'home', component: HomeComponent, canActivate: [authGuard] },

  {
    path: 'patient',
    loadComponent: () => import('./features/patient/patient').then(m => m.Patient),
    canActivate: [authGuard],
  },

  {
    path: 'doctors',
    loadComponent: () => import('./features/doctors/doctors').then(m => m.Doctors),
    canActivate: [authGuard],
  },

  // RDV PUBLIC TEMPORAIRE (sans authGuard)
  {
    path: 'rdv',
    loadComponent: () => import('./features/rdv/rdv').then(m => m.RdvComponent),
  },

  { path: '**', redirectTo: '/login' },
];