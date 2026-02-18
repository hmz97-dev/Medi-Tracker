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

  // Routes Doctors (Lazy Loading)
  {
    path: 'doctors',
    loadComponent: () => import('./features/doctors/doctors').then(m => m.Doctors)
  },

  // Routes RDV (Lazy Loading)
  {
    path: 'rdv',
    loadComponent: () => import('./features/rdv/rdv').then(m => m.RDV)
  },

  // Page 404
  {
    path: '**',
    redirectTo: '/home'
  }
];