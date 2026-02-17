import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../../models/patient.model';

@Injectable({
    providedIn: 'root'
})
export class PatientService {
    private apiUrl = 'http://localhost:8080/api/patients';

    constructor(private http: HttpClient) { }

    // Récupérer tous les patients
    getPatients(): Observable<Patient[]> {
        return this.http.get<Patient[]>(this.apiUrl);
    }

    // Récupérer un patient Grace a l'ID
    getPatientByID(id: number): Observable<Patient>{
        return this.http.get<Patient>(`${this.apiUrl}/${id}`);  
    }

    //Modifier un patient
    updatePatient(patient: Patient): Observable<Patient>{
        return this.http.put<Patient>(`${this.apiUrl}/${patient.id_patient}`, patient);
    }

    //Supprimer un patient
    deletePatient(id: number): Observable<void>{
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
    
    // Rechercher un patient 
    searchPatients(term: string): Observable<Patient[]>{
        return this.http.get<Patient[]>(`${this.apiUrl}/search?term=${term}`);
    }
}