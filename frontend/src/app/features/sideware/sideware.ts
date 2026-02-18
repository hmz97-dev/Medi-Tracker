import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

type SidebarPage = 'patient' | 'doctors' | 'rdv';

@Component({
  selector: 'app-sideware',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sideware.html',
  styleUrl: './sideware.scss',
})
export class Sideware {
  @Input() currentPage: SidebarPage = 'patient';
}
