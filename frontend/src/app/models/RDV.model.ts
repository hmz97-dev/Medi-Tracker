import { Doctor } from '../models/doctor.model';
import { Patient } from '../models/patient.model';

export interface RDV {
  id: number;
  appointment_date: string;
  end_date?: string;
  status: string;
  reason: string;

  id_doctor: number;
  id_patient: number;

  doctor?: Doctor;
  patient?: Patient;
}
