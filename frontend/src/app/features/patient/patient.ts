import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sideware } from '../sideware/sideware';
import { PatientService } from '../../core/service/patient.service';
import { Patient as PatientModel } from '../../models/patient.model';

type GenderFilter = 'All' | 'Male' | 'Female' | 'Other';

interface PatientRow {
	id_patient: number;
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	gender: string;
	email: string;
	description: string;
	adress: string;
	bloodGroup: string;
}

interface NewPatientForm {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	gender: string;
	email: string;
	description: string;
	adress: string;
	bloodGroup: string;
}

type SortColumn = 'firstName' | 'lastName' | 'dateOfBirth' | 'gender' | 'email' | 'adress' | 'bloodGroup';
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

	readonly filters: GenderFilter[] = ['All', 'Male', 'Female', 'Other'];
	readonly pageSize = 15;

	searchTerm = '';
	activeFilter: GenderFilter = 'All';
	showSearch = false;
	showFilter = false;
	showAddForm = false;
	showHelp = false;
	currentPage = 1;
	openedMenuId: number | null = null;
	feedbackMessage = '';
	sortColumn: SortColumn = 'lastName';
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
			const matchesFilter =
				this.activeFilter === 'All' || row.gender === this.activeFilter;
			if (!matchesFilter) return false;
			if (!normalizedTerm) return true;

			return (
				row.firstName.toLowerCase().includes(normalizedTerm) ||
				row.lastName.toLowerCase().includes(normalizedTerm) ||
				row.email.toLowerCase().includes(normalizedTerm)
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
			if (leftValue < rightValue) return this.sortDirection === 'asc' ? -1 : 1;
			if (leftValue > rightValue) return this.sortDirection === 'asc' ? 1 : -1;
			return 0;
		});

		const start = (this.currentPage - 1) * this.pageSize;
		return sortedRows.slice(start, start + this.pageSize);
	}

	get pageNumbers(): number[] {
		return Array.from({ length: this.totalPages }, (_, index) => index + 1);
	}

	genderClass(gender: string): string {
		if (gender === 'Male') return 'gender-male';
		if (gender === 'Female') return 'gender-female';
		return 'gender-other';
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

	setFilter(filter: GenderFilter): void {
		this.activeFilter = filter;
		this.currentPage = 1;
		this.showFilter = false;
		this.openedMenuId = null;
	}

	onSearchChange(): void {
		this.currentPage = 1;
	}

	setPage(page: number): void {
		if (page < 1 || page > this.totalPages) return;
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
		if (this.sortColumn !== column) return '↕';
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
			this.rows = this.rows.filter((row) => row.id_patient !== rowId);
			this.openedMenuId = null;
			if (this.currentPage > this.totalPages) {
				this.currentPage = this.totalPages;
			}
			this.feedbackMessage = 'Patient supprimé avec succès.';
		});
	}

	editRow(rowId: number): void {
		this.openedMenuId = null;
		this.feedbackMessage = 'Fonctionnalité de modification à venir.';
	}

	addPatient(): void {
		const form = this.newPatient;
		if (
			!form.firstName.trim() ||
			!form.lastName.trim() ||
			!form.dateOfBirth.trim() ||
			!form.gender ||
			!form.email.trim()
		) {
			this.feedbackMessage = 'Merci de compléter tous les champs obligatoires (prénom, nom, date de naissance, genre, email).';
			return;
		}

		const payload: PatientModel = {
			id_patient: 0,
			first_name: form.firstName.trim(),
			last_name: form.lastName.trim(),
			date_of_birth: new Date(form.dateOfBirth),
			gender: form.gender,
			email: form.email.trim(),
			phone: '',
			blood_group: form.bloodGroup,
			description: form.description.trim(),
			adress: form.adress.trim()
		};

		this.patientService.createPatient(payload).subscribe((created) => {
			this.rows = [this.mapPatientToRow(created), ...this.rows];
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
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			gender: '',
			email: '',
			description: '',
			adress: '',
			bloodGroup: ''
		};
	}

	private loadPatients(): void {
		this.patientService.getPatients().subscribe((patients) => {
			this.rows = patients.map((p) => this.mapPatientToRow(p));
			if (this.currentPage > this.totalPages) {
				this.currentPage = this.totalPages;
			}
		});
	}

	private mapPatientToRow(patient: PatientModel): PatientRow {
		return {
			id_patient: patient.id_patient,
			firstName: patient.first_name ?? '',
			lastName: patient.last_name ?? '',
			dateOfBirth: patient.date_of_birth
				? new Date(patient.date_of_birth).toLocaleDateString('fr-FR')
				: '-',
			gender: patient.gender ?? '-',
			email: patient.email ?? '-',
			description: patient.description?.trim() ? patient.description : '-',
			adress: patient.adress?.trim() ? patient.adress : '-',
			bloodGroup: patient.blood_group ?? '-'
		};
	}
}