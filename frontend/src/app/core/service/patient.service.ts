import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Patient } from '../../models/patient.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = `${environment.apiUrl}/patients`;

  constructor(private http: HttpClient) {}

  getPatients(): Observable<Patient[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((patients) => patients.map((p) => this.fromApiPatient(p)))
    );
  }

  getPatientById(id: number): Observable<Patient> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((p) => this.fromApiPatient(p))
    );
  }

  createPatient(patient: Patient): Observable<Patient> {
    return this.http.post<any>(this.apiUrl, this.toApiPatient(patient)).pipe(
      map((res) => this.fromApiPatient(res.patient ?? res))
    );
  }

  updatePatient(patient: Patient): Observable<Patient> {
    return this.http.put<any>(`${this.apiUrl}/${patient.id_patient}`, this.toApiPatient(patient)).pipe(
      map((res) => this.fromApiPatient(res.patient ?? res))
    );
  }

  deletePatient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // -------------------------
  // MAPPERS
  // -------------------------
  private fromApiPatient(p: any): Patient {
    // Si l'API fournit dateOfBirth/date_of_birth on le lit, sinon valeur par défaut
    const dobRaw = p.dateOfBirth ?? p.date_of_birth ?? null;
    const dob = dobRaw ? new Date(dobRaw) : new Date('1990-01-01');

    return {
      id_patient: p.id,
      first_name: p.firstName,
      last_name: p.lastName,
      email: p.email ?? '',
      phone: p.phoneNumber ?? '',
      blood_group: p.bloodGroup ?? '',
      gender: p.gender ?? '',
      date_of_birth: dob
    };
  }

  private toApiPatient(patient: Patient): any {
    return {
      firstName: patient.first_name,
      lastName: patient.last_name,
      email: patient.email,
      phoneNumber: patient.phone,
      bloodGroup: patient.blood_group,
      gender: patient.gender,
      dateOfBirth: patient.date_of_birth
        ? new Date(patient.date_of_birth).toISOString().slice(0, 10)
        : null
    };
  }
}