import { Patient } from '../../models/patient.model';

export const MOCK_PATIENTS: Patient[] = [
  {
    id_patient: 1,
    first_name: 'Jean',
    last_name: 'Dupont',
    email: 'jean.dupont@email.com',
    phone: '0612345678',
    date_of_birth: new Date('1985-03-15'),
    gender: 'M',
    blood_group: 'O+',
    description: 'Patient régulier, suivi pour hypertension'
  },
  {
    id_patient: 2,
    first_name: 'Marie',
    last_name: 'Martin',
    email: 'marie.martin@email.com',
    phone: '0623456789',
    date_of_birth: new Date('1990-07-22'),
    gender: 'F',
    blood_group: 'A+',
    description: 'Suivi gynécologique'
  },
  {
    id_patient: 3,
    first_name: 'Pierre',
    last_name: 'Durand',
    email: 'pierre.durand@email.com',
    phone: '0634567890',
    date_of_birth: new Date('1978-11-30'),
    gender: 'M',
    blood_group: 'B+',
    description: 'Diabète type 2'
  },
  {
    id_patient: 4,
    first_name: 'Sophie',
    last_name: 'Bernard',
    email: 'sophie.bernard@email.com',
    phone: '0645678901',
    date_of_birth: new Date('1995-05-10'),
    gender: 'F',
    blood_group: 'AB+',
    description: 'Aucun antécédent particulier'
  },
  {
    id_patient: 5,
    first_name: 'Luc',
    last_name: 'Petit',
    email: 'luc.petit@email.com',
    phone: '0656789012',
    date_of_birth: new Date('1982-09-18'),
    gender: 'M',
    blood_group: 'O-',
    description: 'Asthmatique'
  }
];