import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { RDV } from '../../models/RDV.model';
import { MOCK_RDVS } from '../mocks/mock-RDV';

@Injectable({
  providedIn: 'root'
})
export class RDVService {
  // Development mode: mocks + localStorage persistence.
  private useMockData = true;
  private apiUrl = 'http://localhost:8080/api/rdvs';
  private readonly storageKey = 'meditracker-rdvs';
  private mockAppointments = this.loadAppointments();

  constructor() {}

  private loadAppointments(): RDV[] {
    if (!this.useMockData) {
      return [];
    }

    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      const seeded = [...MOCK_RDVS];
      this.saveAppointments(seeded);
      return seeded;
    }

    try {
      const parsed = JSON.parse(raw) as RDV[];
      return Array.isArray(parsed) ? parsed : [...MOCK_RDVS];
    } catch {
      return [...MOCK_RDVS];
    }
  }

  private saveAppointments(items: RDV[]): void {
    if (!this.useMockData) {
      return;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  getRDV(): Observable<RDV[]> {
    if (this.useMockData) {
      return of([...this.mockAppointments]).pipe(delay(120));
    }
    // return this.http.get<RDV[]>(this.apiUrl);
    return of([]);
  }

  getRDVByPatient(patientId: number): Observable<RDV[]> {
    if (this.useMockData) {
      const filtered = this.mockAppointments.filter((a) => a.id_patient === patientId);
      return of(filtered).pipe(delay(120));
    }
    // return this.http.get<RDV[]>(`${this.apiUrl}/patient/${patientId}`);
    return of([]);
  }

  getRDVByDoctor(doctorId: number): Observable<RDV[]> {
    if (this.useMockData) {
      const filtered = this.mockAppointments.filter((a) => a.id_doctor === doctorId);
      return of(filtered).pipe(delay(120));
    }
    // return this.http.get<RDV[]>(`${this.apiUrl}/doctor/${doctorId}`);
    return of([]);
  }

  createRDV(appointment: RDV): Observable<RDV> {
    if (this.useMockData) {
      const currentMaxId = this.mockAppointments.length > 0
        ? Math.max(...this.mockAppointments.map((a) => a.id))
        : 0;
      const newAppointment = { ...appointment, id: currentMaxId + 1 };
      this.mockAppointments.push(newAppointment);
      this.saveAppointments(this.mockAppointments);
      return of(newAppointment).pipe(delay(120));
    }
    // return this.http.post<RDV>(this.apiUrl, appointment);
    return of(appointment);
  }

  updateRDV(appointment: RDV): Observable<RDV> {
    if (this.useMockData) {
      const index = this.mockAppointments.findIndex((a) => a.id === appointment.id);
      if (index !== -1) {
        this.mockAppointments[index] = appointment;
        this.saveAppointments(this.mockAppointments);
      }
      return of(appointment).pipe(delay(120));
    }
    // return this.http.put<RDV>(`${this.apiUrl}/${appointment.id}`, appointment);
    return of(appointment);
  }

  cancelRDV(id: number): Observable<void> {
    if (this.useMockData) {
      const index = this.mockAppointments.findIndex((a) => a.id === id);
      if (index !== -1) {
        this.mockAppointments[index].status = 'cancelled';
        this.saveAppointments(this.mockAppointments);
      }
      return of(void 0).pipe(delay(120));
    }
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);
    return of(void 0);
  }

  deleteRDV(id: number): Observable<void> {
    if (this.useMockData) {
      const index = this.mockAppointments.findIndex((a) => a.id === id);
      if (index !== -1) {
        this.mockAppointments.splice(index, 1);
        this.saveAppointments(this.mockAppointments);
      }
      return of(void 0).pipe(delay(120));
    }
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);
    return of(void 0);
  }

  getAvailableSlots(doctorId: number, date: string): Observable<string[]> {
    if (this.useMockData) {
      const allSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
      ];

      const bookedSlots = this.mockAppointments
        .filter((a) => a.id_doctor === doctorId && a.appointment_date.startsWith(date))
        .map((a) => a.appointment_date.substring(11, 16));

      const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));
      return of(availableSlots).pipe(delay(120));
    }

    // return this.http.get<string[]>(`${this.apiUrl}/available?doctorId=${doctorId}&date=${date}`);
    return of([]);
  }
}
