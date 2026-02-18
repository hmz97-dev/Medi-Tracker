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

  // Routes Patients (Lazy Loading)
  {
    path: 'patients',
    loadComponent: () => import('./features/patients/patients').then(m => m.Patients)
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