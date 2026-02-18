import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Sideware } from '../sideware/sideware';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule, Sideware],
  templateUrl: './doctors.html',
  styleUrl: './doctors.scss',
})
export class Doctors {

  editMode = false;

  doctor = {
    firstName: 'Sophie',
    lastName: 'Leclerc',
    email: 'sophie.leclerc@email.com',
    phone: '0612345678',
    speciality: 'Cardiologie',
    description: "Médecin cardiologue avec 10 ans d'expérience."
  };

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  save() {
    this.editMode = false;
    console.log('Saved doctor:', this.doctor);
  }

}
