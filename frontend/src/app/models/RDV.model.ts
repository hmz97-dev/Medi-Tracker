import { Doctor } from './doctor.model';
import { Patient } from './patient.model';

export interface Appointment {
  id: number;
  appointment_date: string;
  status: string;
  reason: string;

  id_doctor: number;
  id_patient: number;

  doctor?: Doctor;
  patient?: Patient;
}
