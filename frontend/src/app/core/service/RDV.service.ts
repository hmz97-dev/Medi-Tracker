import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RDV } from '../../models/RDV.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RDVService {
  private apiUrl = `${environment.apiUrl}/rdvs`;

  constructor(private http: HttpClient) {}

  getRDV(): Observable<RDV[]> {
    return this.http.get<RDV[]>(this.apiUrl);
  }

  getRDVByPatient(patientId: number): Observable<RDV[]> {
    return this.http.get<RDV[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  getRDVByDoctor(doctorId: number): Observable<RDV[]> {
    return this.http.get<RDV[]>(`${this.apiUrl}/doctor/${doctorId}`);
  }

  createRDV(appointment: RDV): Observable<RDV> {
    return this.http.post<RDV>(this.apiUrl, appointment);
  }

  updateRDV(appointment: RDV): Observable<RDV> {
    return this.http.put<RDV>(`${this.apiUrl}/${appointment.id}`, appointment);
  }

  cancelRDV(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/cancel`, {});
  }

  deleteRDV(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAvailableSlots(doctorId: number, date: string): Observable<string[]> {
    const params = new HttpParams()
      .set('doctorId', doctorId)
      .set('date', date);
    return this.http.get<string[]>(`${this.apiUrl}/available`, { params });
  }
}