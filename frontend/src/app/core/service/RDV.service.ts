import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { RDV } from '../../models/RDV.model';
import { MOCK_RDVS } from '../mocks/mock-RDV';

@Injectable({
  providedIn: 'root'
})
export class RDVService {
  // Mode développement : utiliser les mocks
  private useMockData = true;
  private apiUrl = 'http://localhost:8080/api/rdvs';
  private mockAppointments = [...MOCK_RDVS]; // Copie pour pouvoir modifier

  constructor() {}

  // Récupérer tous les rendez-vous
  getRDV(): Observable<RDV[]> {
    if (this.useMockData) {
      return of(this.mockAppointments).pipe(delay(500));
    }
    // return this.http.get<RDV[]>(this.apiUrl);
    return of([]);
  }

  // Récupérer les RDV d'un patient
  getRDVByPatient(patientId: number): Observable<RDV[]> {
    if (this.useMockData) {
      const filtered = this.mockAppointments.filter(a => a.id_patient === patientId);
      return of(filtered).pipe(delay(300));
    }
    // return this.http.get<RDV[]>(`${this.apiUrl}/patient/${patientId}`);
    return of([]);
  }

  // Récupérer les RDV d'un médecin
  getRDVByDoctor(doctorId: number): Observable<RDV[]> {
    if (this.useMockData) {
      const filtered = this.mockAppointments.filter(a => a.id_doctor === doctorId);
      return of(filtered).pipe(delay(300));
    }
    // return this.http.get<RDV[]>(`${this.apiUrl}/doctor/${doctorId}`);
    return of([]);
  }

  // Créer un rendez-vous
  createRDV(appointment: RDV): Observable<RDV> {
    if (this.useMockData) {
      const newId = Math.max(...this.mockAppointments.map(a => a.id)) + 1;
      const newAppointment = { ...appointment, id: newId };
      this.mockAppointments.push(newAppointment);
      return of(newAppointment).pipe(delay(500));
    }
    // return this.http.post<RDV>(this.apiUrl, appointment);
    return of(appointment);
  }

  // Modifier un rendez-vous
  updateRDV(appointment: RDV): Observable<RDV> {
    if (this.useMockData) {
      const index = this.mockAppointments.findIndex(a => a.id === appointment.id);
      if (index !== -1) {
        this.mockAppointments[index] = appointment;
      }
      return of(appointment).pipe(delay(500));
    }
    // return this.http.put<RDV>(`${this.apiUrl}/${appointment.id}`, appointment);
    return of(appointment);
  }

  // Annuler un rendez-vous
  cancelRDV(id: number): Observable<void> {
    if (this.useMockData) {
      const index = this.mockAppointments.findIndex(a => a.id === id);
      if (index !== -1) {
        this.mockAppointments[index].status = 'cancelled';
      }
      return of(void 0).pipe(delay(300));
    }
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);
    return of(void 0);
  }

  // Supprimer définitivement un rendez-vous
  deleteRDV(id: number): Observable<void> {
    if (this.useMockData) {
      const index = this.mockAppointments.findIndex(a => a.id === id);
      if (index !== -1) {
        this.mockAppointments.splice(index, 1);
      }
      return of(void 0).pipe(delay(300));
    }
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);
    return of(void 0);
  }

  // Obtenir les créneaux disponibles
  getAvailableSlots(doctorId: number, date: string): Observable<string[]> {
    if (this.useMockData) {
      // Simulation de créneaux horaires disponibles
      const allSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
      ];
      
      // Filtrer les créneaux déjà pris pour ce médecin à cette date
      const bookedSlots = this.mockAppointments
        .filter(a => a.id_doctor === doctorId && a.appointment_date.startsWith(date) && a.status !== 'cancelled')
        .map(a => a.appointment_date.substring(11, 16));
      
      const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
      return of(availableSlots).pipe(delay(400));
    }
    // return this.http.get<string[]>(`${this.apiUrl}/available?doctorId=${doctorId}&date=${date}`);
    return of([]);
  }
}