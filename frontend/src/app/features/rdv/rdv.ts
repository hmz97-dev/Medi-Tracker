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
import { RDVService } from '../../core/service/RDV.service';
import { PatientService } from '../../core/service/patient.service';
import { Doctor } from '../../models/doctor.model';
import { Patient } from '../../models/patient.model';
import { RDV } from '../../models/RDV.model';

type RdvFormModel = {
  id_patient: number | null;
  id_doctor: number | null;
  appointment_date: string;
  end_date: string;
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
  private appointments: RDV[] = [];
  private patientNames = new Map<number, string>();
  private doctorNames = new Map<number, string>();

  patients: Patient[] = [];
  doctors: Doctor[] = [];
  selectedRdvId: number | null = null;
  uiMessage = '';

  formModel: RdvFormModel = {
    id_patient: null,
    id_doctor: null,
    appointment_date: '',
    end_date: '',
    reason: ''
  };

  constructor(
    private rdvService: RDVService,
    private patientService: PatientService,
    private doctorService: DoctorService
  ) {}

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
    events: this.events,
    select: (arg) => this.onSelect(arg),
    eventClick: (arg) => this.onEventClick(arg),
    eventDrop: (arg) => this.onEventDrop(arg),
    eventResize: (arg) => this.onEventResize(arg)
  };

  ngOnInit(): void {
    this.bootstrapData();
  }

  canSubmitForm(): boolean {
    return Boolean(
      this.formModel.id_patient &&
      this.formModel.id_doctor &&
      this.formModel.appointment_date &&
      this.formModel.end_date
    );
  }

  saveFromForm(): void {
    if (!this.canSubmitForm()) {
      return;
    }

    const start = new Date(this.formModel.appointment_date);
    const end = new Date(this.formModel.end_date);
    if (!(start < end)) {
      return;
    }

    if (this.selectedRdvId) {
      this.updateSelectedRdv();
      return;
    }

    const newRdv: RDV = {
      id: 0,
      id_patient: this.formModel.id_patient as number,
      id_doctor: this.formModel.id_doctor as number,
      appointment_date: start.toISOString(),
      end_date: end.toISOString(),
      status: 'scheduled',
      reason: this.formModel.reason || 'Consultation'
    };

    this.rdvService.createRDV(newRdv).subscribe((created) => {
      this.appointments.push(created);
      this.rebuildEvents();
      this.selectedRdvId = created.id;
    });
  }

  deleteSelected(): void {
    const idToDelete = this.selectedRdvId ?? this.resolveRdvIdFromForm();
    if (!idToDelete) {
      this.uiMessage = 'Selectionne un RDV dans le calendrier avant de supprimer.';
      return;
    }

    this.rdvService.deleteRDV(idToDelete).subscribe(() => {
      this.appointments = this.appointments.filter((r) => r.id !== idToDelete);
      this.rebuildEvents();
      this.resetForm();
      this.uiMessage = 'RDV supprime.';
    });
  }

  resetForm(): void {
    const defaultPatient = this.patients.length > 0 ? this.patients[0].id_patient : null;
    const defaultDoctor = this.doctors.length > 0 ? this.doctors[0].id_doctor : null;

    this.selectedRdvId = null;
    this.uiMessage = '';
    this.formModel = {
      id_patient: defaultPatient,
      id_doctor: defaultDoctor,
      appointment_date: '',
      end_date: '',
      reason: ''
    };
  }

  private updateSelectedRdv(): void {
    if (!this.selectedRdvId) {
      return;
    }

    const existing = this.appointments.find((r) => r.id === this.selectedRdvId);
    if (!existing) {
      return;
    }

    const updated: RDV = {
      ...existing,
      id_patient: this.formModel.id_patient as number,
      id_doctor: this.formModel.id_doctor as number,
      appointment_date: new Date(this.formModel.appointment_date).toISOString(),
      end_date: new Date(this.formModel.end_date).toISOString(),
      reason: this.formModel.reason || existing.reason
    };

    this.rdvService.updateRDV(updated).subscribe(() => {
      this.appointments = this.appointments.map((r) => (r.id === updated.id ? updated : r));
      this.rebuildEvents();
    });
  }

  private bootstrapData(): void {
    forkJoin({
      patients: this.patientService.getPatients(),
      doctors: this.doctorService.getDoctors(),
      appointments: this.rdvService.getRDV()
    }).subscribe(({ patients, doctors, appointments }) => {
      this.patients = patients;
      this.doctors = doctors;
      this.patientNames = new Map(
        patients.map((p) => [p.id_patient, `${p.first_name} ${p.last_name}`])
      );
      this.doctorNames = new Map(
        doctors.map((d) => [d.id_doctor, `Dr ${d.last_name}`])
      );
      this.appointments = appointments;
      this.resetForm();
      this.rebuildEvents();
    });
  }

  private rebuildEvents(): void {
    this.events = this.appointments.map((rdv) => this.toCalendarEvent(rdv));
    this.refreshCalendarEvents();
  }

  private toCalendarEvent(rdv: RDV): EventInput {
    const start = new Date(rdv.appointment_date);
    const end = rdv.end_date
      ? new Date(rdv.end_date)
      : new Date(start.getTime() + 30 * 60 * 1000);

    return {
      id: String(rdv.id),
      title: this.buildTitle(rdv.id_patient, rdv.id_doctor),
      start,
      end
    };
  }

  private buildTitle(patientId: number, doctorId: number): string {
    const patient = this.patientNames.get(patientId) ?? `Patient #${patientId}`;
    const doctor = this.doctorNames.get(doctorId) ?? `Dr #${doctorId}`;
    return `${patient} - ${doctor}`;
  }

  private refreshCalendarEvents(): void {
    this.calendarOptions = { ...this.calendarOptions, events: [...this.events] };
  }

  private onSelect(arg: DateSelectArg): void {
    const defaultEnd = arg.end ?? new Date(arg.start.getTime() + 30 * 60 * 1000);
    this.selectedRdvId = null;
    this.uiMessage = '';
    this.formModel = {
      ...this.formModel,
      appointment_date: this.toLocalDateTimeInput(arg.start),
      end_date: this.toLocalDateTimeInput(defaultEnd)
    };
  }

  private onEventClick(arg: EventClickArg): void {
    const id = Number(arg.event.id);
    const existing = this.appointments.find((r) => r.id === id);
    if (!existing) {
      return;
    }

    this.selectedRdvId = id;
    this.uiMessage = `RDV #${id} selectionne. Tu peux maintenant modifier ou supprimer.`;
    this.formModel = {
      id_patient: existing.id_patient,
      id_doctor: existing.id_doctor,
      appointment_date: this.toLocalDateTimeInput(existing.appointment_date),
      end_date: this.toLocalDateTimeInput(existing.end_date ?? existing.appointment_date),
      reason: existing.reason
    };
  }

  private onEventDrop(arg: EventDropArg): void {
    const id = Number(arg.event.id);
    const existing = this.appointments.find((r) => r.id === id);
    if (!existing || !arg.event.start) {
      return;
    }

    const updated: RDV = {
      ...existing,
      appointment_date: arg.event.start.toISOString(),
      end_date: arg.event.end?.toISOString()
    };

    this.rdvService.updateRDV(updated).subscribe(() => {
      this.appointments = this.appointments.map((r) => (r.id === id ? updated : r));
      this.rebuildEvents();
    });
  }

  private onEventResize(arg: EventResizeDoneArg): void {
    const id = Number(arg.event.id);
    const existing = this.appointments.find((r) => r.id === id);
    if (!existing || !arg.event.start || !arg.event.end) {
      return;
    }

    const updated: RDV = {
      ...existing,
      appointment_date: arg.event.start.toISOString(),
      end_date: arg.event.end.toISOString()
    };

    this.rdvService.updateRDV(updated).subscribe(() => {
      this.appointments = this.appointments.map((r) => (r.id === id ? updated : r));
      this.rebuildEvents();
    });
  }

  private toLocalDateTimeInput(dateLike: string | Date): string {
    const date = typeof dateLike === 'string' ? new Date(dateLike) : dateLike;
    const tzOffsetMs = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffsetMs).toISOString().slice(0, 16);
  }

  private resolveRdvIdFromForm(): number | null {
    if (!this.formModel.id_patient || !this.formModel.id_doctor || !this.formModel.appointment_date) {
      return null;
    }

    const startIso = new Date(this.formModel.appointment_date).toISOString();
    const match = this.appointments.find((r) =>
      r.id_patient === this.formModel.id_patient &&
      r.id_doctor === this.formModel.id_doctor &&
      r.appointment_date === startIso
    );

    return match?.id ?? null;
  }
}
