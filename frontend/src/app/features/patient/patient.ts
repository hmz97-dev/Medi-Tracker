import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sideware } from '../sideware/sideware';
import { PatientService } from '../../core/service/patient.service';
import { Patient as PatientModel } from '../../models/patient.model';

type MedicalStatus = 'Recovered' | 'Awaiting surgery' | 'On treatment';
type StatusFilter = 'All' | MedicalStatus;

interface PatientRow {
	id: number;
	name: string;
	diagnosis: string;
	status: MedicalStatus;
	lastAppointment: string;
	nextAppointment: string;
}

interface NewPatientForm {
	name: string;
	diagnosis: string;
	status: MedicalStatus;
	lastAppointment: string;
	nextAppointment: string;
}

type SortColumn = 'name' | 'diagnosis' | 'status' | 'lastAppointment' | 'nextAppointment';
type SortDirection = 'asc' | 'desc';

@Component({
	selector: 'app-patient',
	standalone: true,
	imports: [CommonModule, FormsModule, Sideware],
	templateUrl: './patient.html',
	styleUrl: './patient.scss'
})
export class Patient implements OnInit {
	constructor(private patientService: PatientService) {}

	readonly filters: StatusFilter[] = ['All', 'Recovered', 'Awaiting surgery', 'On treatment'];
	readonly pageSize = 15;

	searchTerm = '';
	activeFilter: StatusFilter = 'All';
	showSearch = false;
	showFilter = false;
	showAddForm = false;
	showHelp = false;
	currentPage = 1;
	openedMenuId: number | null = null;
	feedbackMessage = '';
	sortColumn: SortColumn = 'name';
	sortDirection: SortDirection = 'asc';

	newPatient: NewPatientForm = this.emptyForm();

	rows: PatientRow[] = [];

	ngOnInit(): void {
		this.loadPatients();
	}

	get totalPatients(): number {
		return this.rows.length;
	}

	get filteredRows(): PatientRow[] {
		const normalizedTerm = this.searchTerm.trim().toLowerCase();

		return this.rows.filter((row) => {
			const matchesFilter = this.activeFilter === 'All' || row.status === this.activeFilter;
			if (!matchesFilter) {
				return false;
			}

			if (!normalizedTerm) {
				return true;
			}

			return (
				row.name.toLowerCase().includes(normalizedTerm) ||
				row.diagnosis.toLowerCase().includes(normalizedTerm)
			);
		});
	}

	get totalPages(): number {
		return Math.max(1, Math.ceil(this.filteredRows.length / this.pageSize));
	}

	get displayedRows(): PatientRow[] {
		const sortedRows = [...this.filteredRows].sort((left, right) => {
			const leftValue = this.getSortableValue(left, this.sortColumn);
			const rightValue = this.getSortableValue(right, this.sortColumn);

			if (leftValue < rightValue) {
				return this.sortDirection === 'asc' ? -1 : 1;
			}
			if (leftValue > rightValue) {
				return this.sortDirection === 'asc' ? 1 : -1;
			}
			return 0;
		});

		const start = (this.currentPage - 1) * this.pageSize;
		return sortedRows.slice(start, start + this.pageSize);
	}

	get pageNumbers(): number[] {
		return Array.from({ length: this.totalPages }, (_, index) => index + 1);
	}

	statusClass(status: MedicalStatus): string {
		if (status === 'Recovered') {
			return 'status-recovered';
		}
		if (status === 'Awaiting surgery') {
			return 'status-awaiting';
		}
		return 'status-treatment';
	}

	toggleSearch(): void {
		this.showSearch = !this.showSearch;
		if (!this.showSearch) {
			this.searchTerm = '';
			this.currentPage = 1;
		}
		this.openedMenuId = null;
	}

	toggleFilter(): void {
		this.showFilter = !this.showFilter;
	}

	toggleAddForm(): void {
		this.showAddForm = !this.showAddForm;
		if (!this.showAddForm) {
			this.newPatient = this.emptyForm();
		}
	}

	toggleHelp(): void {
		this.showHelp = !this.showHelp;
	}

	setFilter(filter: StatusFilter): void {
		this.activeFilter = filter;
		this.currentPage = 1;
		this.showFilter = false;
		this.openedMenuId = null;
	}

	onSearchChange(): void {
		this.currentPage = 1;
	}

	setPage(page: number): void {
		if (page < 1 || page > this.totalPages) {
			return;
		}
		this.currentPage = page;
	}

	previousPage(): void {
		this.setPage(this.currentPage - 1);
	}

	nextPage(): void {
		this.setPage(this.currentPage + 1);
	}

	toggleRowMenu(rowId: number): void {
		this.openedMenuId = this.openedMenuId === rowId ? null : rowId;
	}

	sortBy(column: SortColumn): void {
		if (this.sortColumn === column) {
			this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			this.sortColumn = column;
			this.sortDirection = 'asc';
		}
	}

	sortIndicator(column: SortColumn): string {
		if (this.sortColumn !== column) {
			return '↕';
		}
		return this.sortDirection === 'asc' ? '↑' : '↓';
	}

	resetView(): void {
		this.searchTerm = '';
		this.activeFilter = 'All';
		this.currentPage = 1;
		this.showSearch = false;
		this.showFilter = false;
		this.openedMenuId = null;
		this.feedbackMessage = 'Filtres réinitialisés.';
	}

	deleteRow(rowId: number): void {
		this.patientService.deletePatient(rowId).subscribe(() => {
			this.rows = this.rows.filter((row) => row.id !== rowId);
			this.openedMenuId = null;
			if (this.currentPage > this.totalPages) {
				this.currentPage = this.totalPages;
			}
		});
	}

	cycleStatus(rowId: number): void {
		this.rows = this.rows.map((row) => {
			if (row.id !== rowId) {
				return row;
			}

			if (row.status === 'Recovered') {
				return { ...row, status: 'Awaiting surgery' };
			}
			if (row.status === 'Awaiting surgery') {
				return { ...row, status: 'On treatment' };
			}
			return { ...row, status: 'Recovered' };
		});
		this.openedMenuId = null;
		this.feedbackMessage = 'Statut du patient mis à jour.';
	}

	addPatient(): void {
		const form = this.newPatient;
		if (!form.name.trim() || !form.diagnosis.trim() || !form.lastAppointment.trim() || !form.nextAppointment.trim()) {
			this.feedbackMessage = 'Merci de compléter tous les champs du nouveau patient.';
			return;
		}

		const nameParts = form.name.trim().split(' ').filter(Boolean);
		const firstName = nameParts[0] ?? 'Patient';
		const lastName = nameParts.slice(1).join(' ') || 'Nouveau';
		const emailBase = `${firstName}.${lastName}`.replace(/\s+/g, '.').toLowerCase();

		const payload: PatientModel = {
			id_patient: 0,
			first_name: firstName,
			last_name: lastName,
			email: `${emailBase}.${Date.now()}@meditracker.local`,
			phone: '',
			date_of_birth: new Date('1990-01-01'),
			gender: 'N/A',
			blood_group: 'O+',
			description: form.diagnosis.trim()
		};

		this.patientService.createPatient(payload).subscribe((created) => {
			const createdRow = this.mapPatientToRow(created);
			createdRow.status = form.status;
			createdRow.lastAppointment = form.lastAppointment.trim();
			createdRow.nextAppointment = form.nextAppointment.trim();

			this.rows = [createdRow, ...this.rows];
			this.currentPage = 1;
			this.showAddForm = false;
			this.newPatient = this.emptyForm();
			this.feedbackMessage = 'Patient ajouté avec succès.';
		});
	}

	@HostListener('document:click', ['$event'])
	handleDocumentClick(event: MouseEvent): void {
		const target = event.target as HTMLElement;
		if (!target.closest('.row-actions')) {
			this.openedMenuId = null;
		}
	}

	@HostListener('document:keydown.escape')
	handleEscape(): void {
		this.openedMenuId = null;
		this.showFilter = false;
		this.showHelp = false;
	}

	private getSortableValue(row: PatientRow, column: SortColumn): string {
		return String(row[column]).toLowerCase();
	}

	private emptyForm(): NewPatientForm {
		return {
			name: '',
			diagnosis: '',
			status: 'On treatment',
			lastAppointment: '',
			nextAppointment: ''
		};
	}

	private loadPatients(): void {
		this.patientService.getPatients().subscribe((patients) => {
			this.rows = patients.map((patient) => this.mapPatientToRow(patient));
			if (this.currentPage > this.totalPages) {
				this.currentPage = this.totalPages;
			}
		});
	}

	private mapPatientToRow(patient: PatientModel): PatientRow {
		return {
			id: patient.id_patient,
			name: `${patient.first_name} ${patient.last_name}`,
			diagnosis: patient.description?.trim() ? patient.description : '-',
			status: 'On treatment',
			lastAppointment: '-',
			nextAppointment: '-'
		};
	}
}
