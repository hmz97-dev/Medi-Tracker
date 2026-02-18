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
    loadChildren: () => import('./features/patients/patients.routes').then(m => m.PATIENT_ROUTES)
  },

  // Routes Doctors (Lazy Loading)
  {
    path: 'doctors',
    loadChildren: () => import('./features/doctors/doctors.routes').then(m => m.DOCTOR_ROUTES)
  },

  // Routes RDV (Lazy Loading)
  {
    path: 'RDV',
    loadChildren: () => import('./features/RDV/RDV.routes').then(m => m.RDV_ROUTES)
  },

  // Page 404
  {
    path: '**',
    redirectTo: '/home'
  }
];