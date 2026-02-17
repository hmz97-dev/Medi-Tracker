import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Doctor } from '../../models/doctor.model';
import { MOCK_DOCTORS } from '../mocks/mock-doctors';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  // Mode développement : utiliser les mocks
  private useMockData = true;
  private apiUrl = 'http://localhost:8080/api/doctors';
  private mockDoctors = [...MOCK_DOCTORS]; // Copie pour pouvoir modifier

  constructor() {}

  // Récupérer tous les médecins
  getDoctors(): Observable<Doctor[]> {
    if (this.useMockData) {
      return of(this.mockDoctors).pipe(delay(500));
    }
    // return this.http.get<Doctor[]>(this.apiUrl);
    return of([]);
  }

  // Récupérer un médecin par ID
  getDoctorById(id: number): Observable<Doctor | undefined> {
    if (this.useMockData) {
      const doctor = this.mockDoctors.find(d => d.id_doctor === id);
      return of(doctor).pipe(delay(300));
    }
    // return this.http.get<Doctor>(`${this.apiUrl}/${id}`);
    return of(undefined);
  }

  // Créer un nouveau médecin
  createDoctor(doctor: Doctor): Observable<Doctor> {
    if (this.useMockData) {
      const newId = Math.max(...this.mockDoctors.map(d => d.id_doctor)) + 1;
      const newDoctor = { ...doctor, id_doctor: newId };
      this.mockDoctors.push(newDoctor);
      return of(newDoctor).pipe(delay(500));
    }
    // return this.http.post<Doctor>(this.apiUrl, doctor);
    return of(doctor);
  }

  // Modifier un médecin
  updateDoctor(doctor: Doctor): Observable<Doctor> {
    if (this.useMockData) {
      const index = this.mockDoctors.findIndex(d => d.id_doctor === doctor.id_doctor);
      if (index !== -1) {
        this.mockDoctors[index] = doctor;
      }
      return of(doctor).pipe(delay(500));
    }
    // return this.http.put<Doctor>(`${this.apiUrl}/${doctor.id_doctor}`, doctor);
    return of(doctor);
  }

  // Supprimer un médecin
  deleteDoctor(id: number): Observable<void> {
    if (this.useMockData) {
      const index = this.mockDoctors.findIndex(d => d.id_doctor === id);
      if (index !== -1) {
        this.mockDoctors.splice(index, 1);
      }
      return of(void 0).pipe(delay(300));
    }
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);
    return of(void 0);
  }

  // Filtrer par spécialité
  getDoctorsBySpeciality(speciality: string): Observable<Doctor[]> {
    if (this.useMockData) {
      const filtered = this.mockDoctors.filter(d => 
        d.speciality.toLowerCase() === speciality.toLowerCase()
      );
      return of(filtered).pipe(delay(300));
    }
    // return this.http.get<Doctor[]>(`${this.apiUrl}/speciality/${speciality}`);
    return of([]);
  }
}