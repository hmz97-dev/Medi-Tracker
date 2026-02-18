import { Routes } from '@angular/router';
import { PatientList } from './patient-list/patient-list';
import { PatientDetail } from './patient-detail/patient-detail';
import { PatientForm } from './patient-form/patient-form';

export const PATIENT_ROUTES: Routes = [
  {
    path: '',
    component: PatientList
  },
  {
    path: 'new',
    component: PatientForm
  },
  {
    path: ':id',
    component: PatientDetail
  },
  {
    path: ':id/edit',
    component: PatientForm
  }
];