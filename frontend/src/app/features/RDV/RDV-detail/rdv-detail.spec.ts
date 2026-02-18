import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RDVDetail } from './rdv-detail';

describe('RDVDetail', () => {
  let component: RDVDetail;
  let fixture: ComponentFixture<RDVDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RDVDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RDVDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
