import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sideware } from './sideware';

describe('Sideware', () => {
  let component: Sideware;
  let fixture: ComponentFixture<Sideware>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sideware]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sideware);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
