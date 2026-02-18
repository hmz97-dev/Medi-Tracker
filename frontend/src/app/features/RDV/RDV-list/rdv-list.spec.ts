import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RDVList } from './rdv-list';

describe('RDVList', () => {
  let component: RDVList;
  let fixture: ComponentFixture<RDVList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RDVList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RDVList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
