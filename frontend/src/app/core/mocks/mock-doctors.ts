import { Doctor } from '../../models/doctor.model';

export const MOCK_DOCTORS: Doctor[] = [
  {
    id_doctor: 1,
    first_name: 'Sophie',
    last_name: 'Leclerc',
    email: 'dr.leclerc@meditracker.com',
    phone: '0142345678',
    speciality: 'Cardiologie',
    description: '15 ans d\'expérience en cardiologie interventionnelle'
  },
  {
    id_doctor: 2,
    first_name: 'Thomas',
    last_name: 'Moreau',
    email: 'dr.moreau@meditracker.com',
    phone: '0143456789',
    speciality: 'Médecine générale',
    description: 'Médecin de famille, consultation générale'
  },
  {
    id_doctor: 3,
    first_name: 'Isabelle',
    last_name: 'Laurent',
    email: 'dr.laurent@meditracker.com',
    phone: '0144567890',
    speciality: 'Gynécologie',
    description: 'Spécialiste en obstétrique et gynécologie'
  },
  {
    id_doctor: 4,
    first_name: 'Marc',
    last_name: 'Simon',
    email: 'dr.simon@meditracker.com',
    phone: '0145678901',
    speciality: 'Pédiatrie',
    description: 'Pédiatre avec expertise en néonatologie'
  },
  {
    id_doctor: 5,
    first_name: 'Claire',
    last_name: 'Dubois',
    email: 'dr.dubois@meditracker.com',
    phone: '0146789012',
    speciality: 'Dermatologie',
    description: 'Dermatologue spécialisée en dermatologie esthétique'
  }
];