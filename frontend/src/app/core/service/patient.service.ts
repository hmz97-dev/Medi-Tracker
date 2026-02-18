import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Patient } from '../../models/patient.model';
import { MOCK_PATIENTS } from '../mocks/mock-patients';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  // Mode développement : utiliser les mocks
  private useMockData = true;
  private apiUrl = 'http://localhost:8080/api/patients';
  private mockPatients = [...MOCK_PATIENTS]; // Copie pour pouvoir modifier

  constructor() {}

  // Récupérer tous les patients
  getPatients(): Observable<Patient[]> {
    if (this.useMockData) {
      // Simule un délai réseau
      return of(this.mockPatients).pipe(delay(500));
    }
    // Code pour la vraie API (commenté pour l'instant)
    // return this.http.get<Patient[]>(this.apiUrl);
    return of([]);
  }

  // Récupérer un patient par ID
  getPatientById(id: number): Observable<Patient | undefined> {
    if (this.useMockData) {
      const patient = this.mockPatients.find(p => p.id_patient === id);
      return of(patient).pipe(delay(300));
    }
    // return this.http.get<Patient>(`${this.apiUrl}/${id}`);
    return of(undefined);
  }

  // Créer un nouveau patient
  createPatient(patient: Patient): Observable<Patient> {
    if (this.useMockData) {
      const newId = Math.max(...this.mockPatients.map(p => p.id_patient)) + 1;
      const newPatient = { ...patient, id_patient: newId };
      this.mockPatients.push(newPatient);
      return of(newPatient).pipe(delay(500));
    }
    // return this.http.post<Patient>(this.apiUrl, patient);
    return of(patient);
  }

  // Modifier un patient
  updatePatient(patient: Patient): Observable<Patient> {
    if (this.useMockData) {
      const index = this.mockPatients.findIndex(p => p.id_patient === patient.id_patient);
      if (index !== -1) {
        this.mockPatients[index] = patient;
      }
      return of(patient).pipe(delay(500));
    }
    // return this.http.put<Patient>(`${this.apiUrl}/${patient.id_patient}`, patient);
    return of(patient);
  }

  // Supprimer un patient
  deletePatient(id: number): Observable<void> {
    if (this.useMockData) {
      const index = this.mockPatients.findIndex(p => p.id_patient === id);
      if (index !== -1) {
        this.mockPatients.splice(index, 1);
      }
      return of(void 0).pipe(delay(300));
    }
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);
    return of(void 0);
  }

  // Rechercher des patients
  searchPatients(term: string): Observable<Patient[]> {
    if (this.useMockData) {
      const filtered = this.mockPatients.filter(p =>
        p.first_name.toLowerCase().includes(term.toLowerCase()) ||
        p.last_name.toLowerCase().includes(term.toLowerCase()) ||
        p.email.toLowerCase().includes(term.toLowerCase())
      );
      return of(filtered).pipe(delay(300));
    }
    // return this.http.get<Patient[]>(`${this.apiUrl}/search?q=${term}`);
    return of([]);
  }
}