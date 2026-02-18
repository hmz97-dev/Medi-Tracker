import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { DoctorService } from '../../core/service/doctor.service';
import { PatientService } from '../../core/service/patient.service';
import { RDVService } from '../../core/service/RDV.service';
import { Doctor } from '../../models/doctor.model';
import { Patient } from '../../models/patient.model';
import { RDV } from '../../models/RDV.model';

type PatientSection = 'dashboard' | 'profile' | 'appointments' | 'booking' | 'success';

interface PatientAppointmentView extends RDV {
  doctorName: string;
  doctorSpeciality: string;
}

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patients.html',
  styleUrl: './patients.scss',
})
export class Patients implements OnInit {
  private readonly currentPatientId = 1;

  activeSection: PatientSection = 'dashboard';
  loading = true;

  patient: Patient | null = null;
  doctors: Doctor[] = [];
  appointments: PatientAppointmentView[] = [];

  specialities: string[] = [];
  weekdayLabels = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
  dailySlots = [
    '08:00', '08:30', '09:00',
    '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00',
    '14:30', '15:00', '15:30',
    '16:00', '16:30'
  ];
  calendarCurrentMonth = this.startOfMonth(new Date());
  calendarDays: { date: Date | null; dayNumber: number | null; isoDate: string | null; disabled: boolean }[] = [];

  selectedSpeciality = '';
  selectedDoctorId: number | null = null;
  selectedDate = '';
  selectedSlot = '';
  appointmentReason = '';
  availableSlots: string[] = [];
  isSubmittingBooking = false;
  bookingError = '';
  lastBookedAppointment: PatientAppointmentView | null = null;

  constructor(
    private readonly patientService: PatientService,
    private readonly doctorService: DoctorService,
    private readonly rdvService: RDVService
  ) {}

  ngOnInit(): void {
    this.loadPatientWorkspace();
  }

  get patientFullName(): string {
    if (!this.patient) {
      return 'Patient';
    }
    return `${this.patient.first_name} ${this.patient.last_name}`;
  }

  get upcomingAppointments(): PatientAppointmentView[] {
    const now = Date.now();
    return this.appointments.filter(
      (appointment) => appointment.status === 'scheduled' && new Date(appointment.appointment_date).getTime() >= now
    );
  }

  get completedAppointments(): PatientAppointmentView[] {
    return this.appointments.filter((appointment) => appointment.status === 'completed');
  }

  get cancelledAppointments(): PatientAppointmentView[] {
    return this.appointments.filter((appointment) => appointment.status === 'cancelled');
  }

  get nextAppointment(): PatientAppointmentView | null {
    return this.upcomingAppointments[0] ?? null;
  }

  get filteredDoctors(): Doctor[] {
    if (!this.selectedSpeciality) {
      return [];
    }
    return this.doctors.filter((doctor) => doctor.speciality === this.selectedSpeciality);
  }

  get selectedDoctor(): Doctor | null {
    if (!this.selectedDoctorId) {
      return null;
    }
    return this.doctors.find((doctor) => doctor.id_doctor === this.selectedDoctorId) ?? null;
  }

  get bookingStep(): number {
    if (!this.selectedSpeciality) {
      return 1;
    }
    if (!this.selectedDoctorId) {
      return 2;
    }
    if (!this.selectedDate) {
      return 3;
    }
    if (!this.selectedSlot) {
      return 4;
    }
    return 5;
  }

  get calendarMonthLabel(): string {
    return this.calendarCurrentMonth.toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric'
    });
  }

  openSection(section: PatientSection): void {
    this.activeSection = section;
  }

  selectSpeciality(speciality: string): void {
    this.selectedSpeciality = speciality;
    this.selectedDoctorId = null;
    this.selectedDate = '';
    this.selectedSlot = '';
    this.availableSlots = [];
    this.bookingError = '';
  }

  selectDoctor(doctorId: number): void {
    this.selectedDoctorId = doctorId;
    this.selectedDate = '';
    this.selectedSlot = '';
    this.availableSlots = [];
    this.bookingError = '';
  }

  previousMonth(): void {
    const candidate = new Date(this.calendarCurrentMonth);
    candidate.setMonth(candidate.getMonth() - 1);
    const todayMonth = this.startOfMonth(new Date());
    if (candidate < todayMonth) {
      return;
    }
    this.calendarCurrentMonth = candidate;
    this.generateCalendarDays();
  }

  nextMonth(): void {
    const candidate = new Date(this.calendarCurrentMonth);
    candidate.setMonth(candidate.getMonth() + 1);
    this.calendarCurrentMonth = candidate;
    this.generateCalendarDays();
  }

  selectCalendarDay(day: { date: Date | null; dayNumber: number | null; isoDate: string | null; disabled: boolean }): void {
    if (!day.date || !day.isoDate || day.disabled) {
      return;
    }

    this.selectedDate = day.isoDate;
    this.selectedSlot = '';
    this.bookingError = '';
    this.loadAvailableSlots();
  }

  isSelectedDay(isoDate: string | null): boolean {
    return !!isoDate && isoDate === this.selectedDate;
  }

  selectSlot(slot: string): void {
    if (!this.isAvailableSlot(slot)) {
      return;
    }
    this.selectedSlot = slot;
    this.bookingError = '';
  }

  isAvailableSlot(slot: string): boolean {
    return this.availableSlots.includes(slot);
  }

  onDoctorOrDateChange(): void {
    this.loadAvailableSlots();
  }

  loadAvailableSlots(): void {
    this.selectedSlot = '';
    this.availableSlots = [];

    if (!this.selectedDoctorId || !this.selectedDate) {
      return;
    }

    this.rdvService.getAvailableSlots(this.selectedDoctorId, this.selectedDate).subscribe((slots) => {
      this.availableSlots = slots;
    });
  }

  cancelAppointment(appointmentId: number): void {
    this.rdvService.cancelRDV(appointmentId).subscribe(() => {
      this.appointments = this.appointments.map((appointment) =>
        appointment.id === appointmentId ? { ...appointment, status: 'cancelled' } : appointment
      );
    });
  }

  bookAppointment(): void {
    this.bookingError = '';

    if (!this.patient || !this.selectedDoctorId || !this.selectedDate || !this.selectedSlot) {
      this.bookingError = 'Merci de suivre les étapes et compléter la réservation.';
      return;
    }

    const appointmentDate = `${this.selectedDate}T${this.selectedSlot}:00`;
    const payload: RDV = {
      id: 0,
      id_patient: this.patient.id_patient,
      id_doctor: this.selectedDoctorId,
      appointment_date: appointmentDate,
      status: 'scheduled',
      reason: this.appointmentReason.trim() || 'Consultation médicale'
    };

    this.isSubmittingBooking = true;

    this.rdvService.createRDV(payload).subscribe({
      next: (createdAppointment) => {
        const normalized = this.enrichAppointments([createdAppointment])[0];
        this.appointments = [...this.appointments, normalized].sort(
          (a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime()
        );

        this.lastBookedAppointment = normalized;
        this.activeSection = 'success';

        this.selectedSlot = '';
        this.availableSlots = [];
        this.appointmentReason = '';
      },
      error: () => {
        this.bookingError = 'Une erreur est survenue. Réessaie dans un instant.';
      },
      complete: () => {
        this.isSubmittingBooking = false;
      }
    });
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'scheduled':
        return 'Planifié';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  }

  isCancelable(appointment: PatientAppointmentView): boolean {
    return appointment.status === 'scheduled' && new Date(appointment.appointment_date).getTime() > Date.now();
  }

  get selectedDoctorName(): string {
    if (!this.selectedDoctorId) {
      return 'Aucun médecin';
    }
    const doctor = this.doctors.find((item) => item.id_doctor === this.selectedDoctorId);
    return doctor ? `Dr. ${doctor.first_name} ${doctor.last_name}` : 'Aucun médecin';
  }

  private loadPatientWorkspace(): void {
    this.loading = true;

    forkJoin({
      patient: this.patientService.getPatientById(this.currentPatientId),
      doctors: this.doctorService.getDoctors(),
      appointments: this.rdvService.getRDVByPatient(this.currentPatientId)
    }).subscribe({
      next: ({ patient, doctors, appointments }) => {
        this.patient = patient ?? null;
        this.doctors = doctors;
        this.specialities = [...new Set(this.doctors.map((doctor) => doctor.speciality))].sort((a, b) => a.localeCompare(b));
        this.generateCalendarDays();
        this.appointments = this.enrichAppointments(appointments).sort(
          (a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime()
        );
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private enrichAppointments(appointments: RDV[]): PatientAppointmentView[] {
    return appointments.map((appointment) => {
      const doctor = this.doctors.find((item) => item.id_doctor === appointment.id_doctor);
      return {
        ...appointment,
        doctorName: doctor ? `Dr. ${doctor.first_name} ${doctor.last_name}` : 'Médecin non assigné',
        doctorSpeciality: doctor?.speciality ?? 'Spécialité non définie'
      };
    });
  }

  private startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private dateToIso(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private generateCalendarDays(): void {
    const firstDayOfMonth = new Date(this.calendarCurrentMonth.getFullYear(), this.calendarCurrentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(this.calendarCurrentMonth.getFullYear(), this.calendarCurrentMonth.getMonth() + 1, 0);
    const firstWeekDayMondayBased = (firstDayOfMonth.getDay() + 6) % 7;
    const totalDays = lastDayOfMonth.getDate();
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

    const days: { date: Date | null; dayNumber: number | null; isoDate: string | null; disabled: boolean }[] = [];

    for (let i = 0; i < firstWeekDayMondayBased; i += 1) {
      days.push({ date: null, dayNumber: null, isoDate: null, disabled: true });
    }

    for (let day = 1; day <= totalDays; day += 1) {
      const date = new Date(this.calendarCurrentMonth.getFullYear(), this.calendarCurrentMonth.getMonth(), day);
      const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      days.push({
        date,
        dayNumber: day,
        isoDate: this.dateToIso(date),
        disabled: dateStart < todayStart
      });
    }

    while (days.length % 7 !== 0) {
      days.push({ date: null, dayNumber: null, isoDate: null, disabled: true });
    }

    this.calendarDays = days;
  }

}
