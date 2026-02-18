import { Routes } from '@angular/router';
import { DoctorList } from './doctor-list/doctor-list';
import { DoctorDetail } from './doctor-detail/doctor-detail';
import { DoctorForm } from './doctor-form/doctor-form';

export const DOCTOR_ROUTES: Routes = [
  {
    path: '',
    component: DoctorList
  },
  {
    path: 'new',
    component: DoctorForm
  },
  {
    path: ':id',
    component: DoctorDetail
  },
  {
    path: ':id/edit',
    component: DoctorForm
  },
  {
    path: 'speciality/:speciality',
    component: DoctorList  // Filtre par spécialité
  }
];