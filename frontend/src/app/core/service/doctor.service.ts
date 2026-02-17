import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../../models/doctor.model';

@Injectable({
    providedIn: 'root'
})
export class DoctorService {
    private apiUrl = 'http://localhost:8080/api/doctors';

    constructor(private http: HttpClient) { }

    // Récupérer tous les médecins
    getDoctors(): Observable<Doctor[]> {
        return this.http.get<Doctor[]>(this.apiUrl);
    }

    // Récupérer un médecin par ID
    getDoctorByID(id: number): Observable<Doctor>{
        return this.http.get<Doctor>(`${this.apiUrl}/${id}`);  
    }

    // Créer un nouveau médecin
  createDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(this.apiUrl, doctor);
  }

  // Modifier un médecin
  updateDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.apiUrl}/${doctor.id_doctor}`, doctor);
  }

  // Supprimer un médecin
  deleteDoctor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Filtrer par spécialité
  getDoctorsBySpeciality(speciality: string): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/speciality/${speciality}`);
  }
}