import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Sideware } from '../sideware/sideware';
import { DoctorService } from '../../core/service/doctor.service';
import { Doctor } from '../../models/doctor.model';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule, Sideware],
  templateUrl: './doctors.html',
  styleUrl: './doctors.scss',
})
export class Doctors implements OnInit {

  constructor(private doctorService: DoctorService) {}

  editMode = false;
  doctorId: number | null = null;

  doctor = {
    firstName: 'Sophie',
    lastName: 'Leclerc',
    email: 'sophie.leclerc@email.com',
    phone: '0612345678',
    speciality: 'Cardiologie',
    description: "Médecin cardiologue avec 10 ans d'expérience."
  };

  ngOnInit(): void {
    this.loadDoctor();
  }

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  save(): void {
    const payload: Doctor = {
      id_doctor: this.doctorId ?? 0,
      first_name: this.doctor.firstName,
      last_name: this.doctor.lastName,
      email: this.doctor.email,
      phone: this.doctor.phone,
      speciality: this.doctor.speciality,
      description: this.doctor.description
    };

    const request$ = this.doctorId
      ? this.doctorService.updateDoctor(payload)
      : this.doctorService.createDoctor(payload);

    request$.subscribe((savedDoctor) => {
      this.doctorId = savedDoctor.id_doctor;
      this.doctor = {
        firstName: savedDoctor.first_name,
        lastName: savedDoctor.last_name,
        email: savedDoctor.email,
        phone: savedDoctor.phone,
        speciality: savedDoctor.speciality,
        description: savedDoctor.description ?? ''
      };
      this.editMode = false;
    });
  }

  private loadDoctor(): void {
    this.doctorService.getDoctors().subscribe((doctors) => {
      if (doctors.length === 0) {
        this.doctorId = null;
        return;
      }

      const firstDoctor = doctors[0];
      this.doctorId = firstDoctor.id_doctor;
      this.doctor = {
        firstName: firstDoctor.first_name,
        lastName: firstDoctor.last_name,
        email: firstDoctor.email,
        phone: firstDoctor.phone,
        speciality: firstDoctor.speciality,
        description: firstDoctor.description ?? ''
      };
    });
  }

}
