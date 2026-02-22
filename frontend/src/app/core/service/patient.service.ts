import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
      map((patients) => patients.map((patient) => this.fromApiPatient(patient)))
    );
  }

  getPatientById(id: number): Observable<Patient> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((patient) => this.fromApiPatient(patient))
    );
  }

  createPatient(patient: Patient): Observable<Patient> {
    return this.http.post<any>(this.apiUrl, this.toApiPatient(patient)).pipe(
      map((response) => this.fromApiPatient(response.patient ?? response))
    );
  }

  updatePatient(patient: Patient): Observable<Patient> {
    return this.http.put<any>(`${this.apiUrl}/${patient.id_patient}`, this.toApiPatient(patient)).pipe(
      map((response) => this.fromApiPatient(response.patient ?? response))
    );
  }

  deletePatient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchPatients(term: string): Observable<Patient[]> {
    const params = new HttpParams().set('q', term.toLowerCase());
    return this.getPatients().pipe(
      map((patients) =>
        patients.filter((patient) =>
          `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(params.get('q') ?? '')
        )
      )
    );
  }

  private fromApiPatient(patient: any): Patient {
    return {
      id_patient: patient.id,
      first_name: patient.firstName,
      last_name: patient.lastName,
      email: patient.email,
      phone: '',
      date_of_birth: patient.dateNaissance ? new Date(patient.dateNaissance) : new Date(),
      gender: patient.gender,
      blood_group: patient.bloodGroup,
      description: patient.description
    };
  }

  private toApiPatient(patient: Patient): any {
    const dateOfBirth = patient.date_of_birth instanceof Date
      ? patient.date_of_birth
      : new Date(patient.date_of_birth);

    return {
      firstName: patient.first_name,
      lastName: patient.last_name,
      dateNaissance: dateOfBirth.toISOString().slice(0, 10),
      gender: patient.gender,
      email: patient.email,
      description: patient.description ?? '',
      adress: '',
      bloodGroup: patient.blood_group
    };
  }
}