import { Routes } from '@angular/router';
import { RDVList } from './RDV-list/rdv-list';
import { RDVDetail } from './RDV-detail/rdv-detail';
import { RDVForm } from './RDV-form/rdv-form';

export const RDV_ROUTES: Routes = [
  {
    path: '',
    component: RDVList
  },
  {
    path: 'new',
    component: RDVForm
  },
  {
    path: ':id',
    component: RDVDetail
  },
  {
    path: ':id/edit',
    component: RDVForm
  },
  {
    path: 'patient/:patientId',
    component: RDVList  // RDV d'un patient
  },
  {
    path: 'doctor/:doctorId',
    component: RDVList  // RDV d'un médecin
  }
];