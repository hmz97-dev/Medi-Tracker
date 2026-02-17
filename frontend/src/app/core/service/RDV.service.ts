import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RDV } from '../../models/RDV.model';

@Injectable({
  providedIn: 'root'
})
export class RDVService {
  private apiUrl = 'http://localhost:8080/api/appointments';

  constructor(private http: HttpClient) {}

  // Récupérer tous les rendez-vous
  getRDV(): Observable<RDV[]> {
    return this.http.get<RDV[]>(this.apiUrl);
  }

  // Récupérer les RDV d'un patient
  getRDVByPatient(patientId: number): Observable<RDV[]> {
    return this.http.get<RDV[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  // Récupérer les RDV d'un médecin
  getRDVByDoctor(doctorId: number): Observable<RDV[]> {
    return this.http.get<RDV[]>(`${this.apiUrl}/doctor/${doctorId}`);
  }

  // Créer un rendez-vous
  createRDV(rdv: RDV): Observable<RDV> {
    return this.http.post<RDV>(this.apiUrl, rdv);
  }

  // Modifier un rendez-vous
  updateRDV(rdv: RDV): Observable<RDV> {
    return this.http.put<RDV>(`${this.apiUrl}/${rdv.id}`, rdv);
  }

  // Annuler un rendez-vous
  cancelRDV(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtenir les créneaux disponibles
  getAvailableSlots(doctorId: number, date: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/available?doctorId=${doctorId}&date=${date}`);
  }
}