import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, delay, of } from 'rxjs';
import { RDV } from '../../models/RDV.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RDVService {
  private apiUrl = `${environment.apiUrl}/rdvs`;

  // Optionnel: mode mock (désactivé par défaut)
  private useMockData = false;
  private readonly storageKey = 'meditracker-rdvs';
  private mockAppointments: RDV[] = this.useMockData ? this.loadAppointments() : [];

  constructor(private http: HttpClient) {}

  private loadAppointments(): RDV[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as RDV[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private saveAppointments(items: RDV[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  getRDV(): Observable<RDV[]> {
    if (this.useMockData) {
      return of([...this.mockAppointments]).pipe(delay(120));
    }
    return this.http.get<RDV[]>(this.apiUrl);
  }

  getRDVByPatient(patientId: number): Observable<RDV[]> {
    if (this.useMockData) {
      const filtered = this.mockAppointments.filter((a) => a.id_patient === patientId);
      return of(filtered).pipe(delay(120));
    }
    return this.http.get<RDV[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  getRDVByDoctor(doctorId: number): Observable<RDV[]> {
    if (this.useMockData) {
      const filtered = this.mockAppointments.filter((a) => a.id_doctor === doctorId);
      return of(filtered).pipe(delay(120));
    }
    return this.http.get<RDV[]>(`${this.apiUrl}/doctor/${doctorId}`);
  }

  createRDV(appointment: RDV): Observable<RDV> {
    if (this.useMockData) {
      const currentMaxId =
        this.mockAppointments.length > 0 ? Math.max(...this.mockAppointments.map((a) => a.id)) : 0;
      const newAppointment = { ...appointment, id: currentMaxId + 1 };
      this.mockAppointments.push(newAppointment);
      this.saveAppointments(this.mockAppointments);
      return of(newAppointment).pipe(delay(120));
    }
    return this.http.post<RDV>(this.apiUrl, appointment);
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
    return this.http.put<RDV>(`${this.apiUrl}/${appointment.id}`, appointment);
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
    return this.http.patch<void>(`${this.apiUrl}/${id}/cancel`, {});
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
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
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

      return of(allSlots.filter((slot) => !bookedSlots.includes(slot))).pipe(delay(120));
    }

    const params = new HttpParams().set('doctorId', doctorId).set('date', date);
    return this.http.get<string[]>(`${this.apiUrl}/available`, { params });
  }
}
