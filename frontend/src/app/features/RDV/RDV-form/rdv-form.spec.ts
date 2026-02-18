import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RDVForm } from './rdv-form';

describe('RDVForm', () => {
  let component: RDVForm;
  let fixture: ComponentFixture<RDVForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RDVForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RDVForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
