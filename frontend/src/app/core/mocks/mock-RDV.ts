import { RDV } from '../../models/RDV.model';

export const MOCK_RDVS: RDV[] = [
  {
    id: 1,
    id_patient: 1,
    id_doctor: 1,
    appointment_date: '2026-02-20T09:00:00',
    status: 'scheduled',
    reason: 'Consultation de suivi hypertension'
  },
  {
    id: 2,
    id_patient: 2,
    id_doctor: 3,
    appointment_date: '2026-02-20T10:30:00',
    status: 'scheduled',
    reason: 'Examen gynécologique annuel'
  },
  {
    id: 3,
    id_patient: 3,
    id_doctor: 2,
    appointment_date: '2026-02-21T14:00:00',
    status: 'scheduled',
    reason: 'Contrôle glycémie'
  },
  {
    id: 4,
    id_patient: 1,
    id_doctor: 2,
    appointment_date: '2026-02-15T11:00:00',
    status: 'completed',
    reason: 'Consultation générale'
  },
  {
    id: 5,
    id_patient: 4,
    id_doctor: 5,
    appointment_date: '2026-02-22T15:30:00',
    status: 'scheduled',
    reason: 'Consultation dermatologique'
  },
  {
    id: 6,
    id_patient: 2,
    id_doctor: 1,
    appointment_date: '2026-02-18T09:30:00',
    status: 'cancelled',
    reason: 'Douleurs thoraciques'
  }
];