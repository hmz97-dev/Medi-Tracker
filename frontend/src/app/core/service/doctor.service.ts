import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Doctor } from '../../models/doctor.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = `${environment.apiUrl}/doctors`;

  constructor(private http: HttpClient) {}

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((doctors) => doctors.map((doctor) => this.fromApiDoctor(doctor)))
    );
  }

  getDoctorById(id: number): Observable<Doctor> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((doctor) => this.fromApiDoctor(doctor))
    );
  }

  createDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.post<any>(this.apiUrl, this.toApiDoctor(doctor)).pipe(
      map((response) => this.fromApiDoctor(response.doctor ?? response))
    );
  }

  updateDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.put<any>(`${this.apiUrl}/${doctor.id_doctor}`, this.toApiDoctor(doctor)).pipe(
      map((response) => this.fromApiDoctor(response.doctor ?? response))
    );
  }

  deleteDoctor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getDoctorsBySpeciality(speciality: string): Observable<Doctor[]> {
    return this.getDoctors().pipe(
      map((doctors) => doctors.filter((doctor) => doctor.speciality === speciality))
    );
  }

  private fromApiDoctor(doctor: any): Doctor {
    return {
      id_doctor: doctor.id,
      first_name: doctor.firstName,
      last_name: doctor.lastName,
      email: doctor.email,
      phone: doctor.phoneNumber,
      speciality: doctor.speciality,
      description: doctor.description
    };
  }

  private toApiDoctor(doctor: Doctor): any {
    return {
      firstName: doctor.first_name,
      lastName: doctor.last_name,
      email: doctor.email,
      phoneNumber: doctor.phone,
      speciality: doctor.speciality,
      description: doctor.description ?? ''
    };
  }
}