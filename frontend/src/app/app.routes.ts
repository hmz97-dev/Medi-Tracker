import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  // Page d'accueil
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },

  // Home
  {
    path: 'home',
    component: HomeComponent
  },

  // Route Patient (Lazy Loading)
  {
    path: 'patient',
    loadComponent: () => import('./features/patient/patient').then(m => m.Patient)
  },

  // Doctors (Lazy Loading)
  {
    path: 'doctors',
    loadComponent: () =>
      import('./features/doctors/doctors').then(m => m.Doctors)
  },

  // RDV (Lazy Loading) ✅ CORRIGÉ
  {
    path: 'rdv',
    loadComponent: () =>
      import('./features/rdv/rdv').then(m => m.RdvComponent)
  },

  // 404
  {
    path: '**',
    redirectTo: '/home'
  }
];
