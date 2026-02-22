import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RDV } from '../../models/RDV.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RDVService {
  private apiUrl = `${environment.apiUrl}/rdvs`;

  constructor(private http: HttpClient) {}

  getRDV(): Observable<RDV[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((rdvs) => rdvs.map((rdv) => this.fromApiRdv(rdv)))
    );
  }

  getRDVByPatient(patientId: number): Observable<RDV[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/patients/${patientId}/rdvs`).pipe(
      map((rdvs) => rdvs.map((rdv) => this.fromApiRdv(rdv)))
    );
  }

  getRDVByDoctor(doctorId: number): Observable<RDV[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/doctors/${doctorId}/rdvs`).pipe(
      map((rdvs) => rdvs.map((rdv) => this.fromApiRdv(rdv)))
    );
  }

  createRDV(appointment: RDV): Observable<RDV> {
    return this.http.post<any>(this.apiUrl, this.toApiRdv(appointment)).pipe(
      map((response) => this.fromApiRdv(response.rdv ?? response))
    );
  }

  updateRDV(appointment: RDV): Observable<RDV> {
    return this.http.put<any>(`${this.apiUrl}/${appointment.id}`, this.toApiRdv(appointment)).pipe(
      map((response) => this.fromApiRdv(response.rdv ?? response))
    );
  }

  cancelRDV(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, { status: 'cancelled' });
  }

  deleteRDV(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAvailableSlots(doctorId: number, date: string): Observable<string[]> {
    return this.getRDVByDoctor(doctorId).pipe(
      map((rdvs) => {
        const allSlots = [
          '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
          '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
        ];

        const bookedSlots = rdvs
          .filter((rdv) => rdv.appointment_date.startsWith(date))
          .map((rdv) => rdv.appointment_date.substring(11, 16));

        return allSlots.filter((slot) => !bookedSlots.includes(slot));
      })
    );
  }

  private fromApiRdv(rdv: any): RDV {
    const doctorId = rdv.doctorId ?? rdv.doctor?.id ?? 0;
    const patientId = rdv.patientId ?? rdv.patient?.id ?? 0;

    return {
      id: rdv.id,
      appointment_date: rdv.dateRdv,
      end_date: rdv.dateRdv,
      status: rdv.status,
      reason: rdv.reason,
      id_doctor: doctorId,
      id_patient: patientId,
      doctor: rdv.doctor
        ? {
            id_doctor: rdv.doctor.id,
            first_name: rdv.doctor.firstName,
            last_name: rdv.doctor.lastName,
            email: '',
            phone: '',
            speciality: rdv.doctor.speciality,
            description: ''
          }
        : undefined,
      patient: rdv.patient
        ? {
            id_patient: rdv.patient.id,
            first_name: rdv.patient.firstName,
            last_name: rdv.patient.lastName,
            email: '',
            phone: '',
            date_of_birth: new Date(),
            gender: '',
            blood_group: rdv.patient.bloodGroup,
            description: ''
          }
        : undefined
    };
  }

  private toApiRdv(appointment: RDV): any {
    const dateRdv = appointment.appointment_date.slice(0, 10);

    return {
      dateRdv,
      reason: appointment.reason,
      status: appointment.status,
      doctorId: appointment.id_doctor,
      patientId: appointment.id_patient
    };
  }
}
