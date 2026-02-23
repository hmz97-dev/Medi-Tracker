import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type ApiDoctor = { id: number; firstName: string; lastName: string; speciality?: string };
export type ApiPatient = { id: number; firstName: string; lastName: string; bloodGroup?: string };
export type ApiRDV = {
  id: number;
  dateRdv: string;   // "YYYY-MM-DD"
  reason: string;
  status: string;
  doctor: ApiDoctor;
  patient: ApiPatient;
};

@Injectable({ providedIn: 'root' })
export class RDVService {
  private apiUrl = `${environment.apiUrl}/rdvs`;

  constructor(private http: HttpClient) {}

  getRDV(): Observable<ApiRDV[]> {
    return this.http.get<ApiRDV[]>(this.apiUrl);
  }

  createRDV(payload: Partial<ApiRDV>): Observable<ApiRDV> {
    return this.http.post<ApiRDV>(this.apiUrl, payload);
  }

  updateRDV(payload: ApiRDV): Observable<ApiRDV> {
    return this.http.put<ApiRDV>(`${this.apiUrl}/${payload.id}`, payload);
  }

  deleteRDV(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}