import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventDropArg,
  EventInput
} from '@fullcalendar/core';
import { EventResizeDoneArg } from '@fullcalendar/interaction';
import { forkJoin } from 'rxjs';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

import { Sideware } from '../sideware/sideware';
import { DoctorService } from '../../core/service/doctor.service';
import { RDVService, ApiRDV, ApiDoctor, ApiPatient } from '../../core/service/RDV.service';
import { PatientService } from '../../core/service/patient.service';

type RdvFormModel = {
  patientId: number | null;
  doctorId: number | null;
  start: string; // datetime-local
  end: string;   // datetime-local
  reason: string;
};

@Component({
  selector: 'app-rdv',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule, Sideware],
  templateUrl: './rdv.html',
  styleUrls: ['./rdv.scss']
})
export class RdvComponent implements OnInit {
  private events: EventInput[] = [];
  private appointments: ApiRDV[] = [];

  patients: ApiPatient[] = [];
  doctors: ApiDoctor[] = [];

  selectedRdvId: number | null = null;
  uiMessage = '';

  formModel: RdvFormModel = {
    patientId: null,
    doctorId: null,
    start: '',
    end: '',
    reason: ''
  };

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    locale: 'fr',
    selectable: true,
    editable: true,
    nowIndicator: true,
    allDaySlot: false,
    slotMinTime: '06:00:00',
    slotMaxTime: '20:00:00',
    events: [],
    select: (arg) => this.onSelect(arg),
    eventClick: (arg) => this.onEventClick(arg),
    eventDrop: (arg) => this.onEventDrop(arg),
    eventResize: (arg) => this.onEventResize(arg)
  };

  constructor(
    private rdvService: RDVService,
    private patientService: PatientService,
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  private loadAll(): void {
    forkJoin({
      patients: this.patientService.getPatients(),
      doctors: this.doctorService.getDoctors() as any, // ton DoctorService retourne Doctor[] (mapping), ok
      rdvs: this.rdvService.getRDV()
    }).subscribe({
      next: ({ patients, doctors, rdvs }) => {
        // Patients = API patient
        this.patients = patients as any;

        // Doctors: ton DoctorService mappe vers Doctor model (id_doctor/first_name/last_name)
        // Donc on remap ici vers ApiDoctor format (id/firstName/lastName) pour simplifier RDV
        this.doctors = (doctors as any[]).map(d => ({
          id: d.id_doctor ?? d.id,
          firstName: d.first_name ?? d.firstName,
          lastName: d.last_name ?? d.lastName,
          speciality: d.speciality
        }));

        this.appointments = rdvs;
        this.resetForm();
        this.rebuildEvents();
      },
      error: (e) => {
        console.error(e);
        this.uiMessage = 'Erreur chargement données.';
      }
    });
  }

  private rebuildEvents(): void {
    this.events = this.appointments.map(r => this.toEvent(r));
    this.calendarOptions = { ...this.calendarOptions, events: [...this.events] };
  }

  private toEvent(rdv: ApiRDV): EventInput {
    // API donne date seulement => 09:00 -> 10:00 par défaut
    const start = this.makeDate(rdv.dateRdv, 9, 0);
    const end = this.makeDate(rdv.dateRdv, 10, 0);

    return {
      id: String(rdv.id),
      start,
      end,
      title: this.title(rdv, start, end)
    };
  }

  private title(rdv: ApiRDV, start: Date, end: Date): string {
    const fmt = (d: Date) => d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const p = `${rdv.patient.firstName} ${rdv.patient.lastName}`;
    const d = `Dr ${rdv.doctor.firstName} ${rdv.doctor.lastName}`;
    return `${fmt(start)} - ${fmt(end)} - ${p} - ${d}`;
  }

  private makeDate(dateRdv: string, h: number, m: number): Date {
    if (dateRdv.includes('T')) return new Date(dateRdv);
    const [Y, M, D] = dateRdv.split('-').map(Number);
    return new Date(Y, M - 1, D, h, m, 0);
  }

  private toLocalInput(date: Date): string {
    const tzOffsetMs = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffsetMs).toISOString().slice(0, 16);
  }

  canSubmitForm(): boolean {
    return !!(this.formModel.patientId && this.formModel.doctorId && this.formModel.start && this.formModel.end);
  }

  resetForm(): void {
    this.selectedRdvId = null;
    this.uiMessage = '';

    this.formModel = {
      patientId: this.patients[0]?.id ?? null,
      doctorId: this.doctors[0]?.id ?? null,
      start: '',
      end: '',
      reason: ''
    };
  }

  saveFromForm(): void {
    this.uiMessage = '';

    if (!this.canSubmitForm()) {
      this.uiMessage = 'Remplis patient, médecin, début et fin.';
      return;
    }

    const start = new Date(this.formModel.start);
    const end = new Date(this.formModel.end);
    if (!(start < end)) {
      this.uiMessage = 'Fin doit être après début.';
      return;
    }

    const patient = this.patients.find(p => p.id === this.formModel.patientId);
    const doctor = this.doctors.find(d => d.id === this.formModel.doctorId);

    if (!patient || !doctor) {
      this.uiMessage = 'Patient ou médecin invalide.';
      return;
    }

    const dateRdv = start.toISOString().slice(0, 10);

    if (this.selectedRdvId) {
      const updated: ApiRDV = {
        id: this.selectedRdvId,
        dateRdv,
        reason: this.formModel.reason || 'Consultation',
        status: 'Confirmé',
        patient,
        doctor
      };

      this.rdvService.updateRDV(updated).subscribe({
        next: () => {
          this.appointments = this.appointments.map(r => r.id === updated.id ? updated : r);
          this.rebuildEvents();
          this.uiMessage = 'RDV modifié.';
        },
        error: (e) => { console.error(e); this.uiMessage = 'Erreur modification.'; }
      });
      return;
    }

    const payload: Partial<ApiRDV> = {
      dateRdv,
      reason: this.formModel.reason || 'Consultation',
      status: 'Confirmé',
      patient,
      doctor
    };

    this.rdvService.createRDV(payload).subscribe({
      next: (created) => {
        this.appointments.push(created);
        this.rebuildEvents();
        this.selectedRdvId = created.id;
        this.uiMessage = 'RDV ajouté.';
      },
      error: (e) => { console.error(e); this.uiMessage = 'Erreur ajout.'; }
    });
  }

  deleteSelected(): void {
    this.uiMessage = '';
    if (!this.selectedRdvId) {
      this.uiMessage = 'Clique sur un RDV avant de supprimer.';
      return;
    }

    const id = this.selectedRdvId;
    this.rdvService.deleteRDV(id).subscribe({
      next: () => {
        this.appointments = this.appointments.filter(r => r.id !== id);
        this.rebuildEvents();
        this.resetForm();
        this.uiMessage = 'RDV supprimé.';
      },
      error: (e) => { console.error(e); this.uiMessage = 'Erreur suppression.'; }
    });
  }

  private onSelect(arg: DateSelectArg): void {
    const end = arg.end ?? new Date(arg.start.getTime() + 60 * 60 * 1000);
    this.selectedRdvId = null;
    this.uiMessage = '';
    this.formModel = {
      ...this.formModel,
      start: this.toLocalInput(arg.start),
      end: this.toLocalInput(end)
    };
  }

  private onEventClick(arg: EventClickArg): void {
    const id = Number(arg.event.id);
    const rdv = this.appointments.find(r => r.id === id);
    if (!rdv) return;

    this.selectedRdvId = id;
    this.uiMessage = `RDV #${id} sélectionné.`;

    const start = this.makeDate(rdv.dateRdv, 9, 0);
    const end = this.makeDate(rdv.dateRdv, 10, 0);

    this.formModel = {
      patientId: rdv.patient.id,
      doctorId: rdv.doctor.id,
      start: this.toLocalInput(start),
      end: this.toLocalInput(end),
      reason: rdv.reason
    };
  }

  private onEventDrop(arg: EventDropArg): void {
    const id = Number(arg.event.id);
    const rdv = this.appointments.find(r => r.id === id);
    if (!rdv || !arg.event.start) return;

    const newDate = arg.event.start.toISOString().slice(0, 10);
    const updated: ApiRDV = { ...rdv, dateRdv: newDate };

    this.rdvService.updateRDV(updated).subscribe({
      next: () => {
        this.appointments = this.appointments.map(r => r.id === id ? updated : r);
        this.rebuildEvents();
      },
      error: (e) => { console.error(e); arg.revert(); }
    });
  }

  private onEventResize(arg: EventResizeDoneArg): void {
    // API ne gère pas end_date -> on ignore resize
    arg.revert();
    this.uiMessage = 'Resize ignoré (API ne gère pas end_date).';
  }
}