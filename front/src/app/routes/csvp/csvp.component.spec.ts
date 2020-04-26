import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvpComponent } from './csvp.component';

describe('CsvpComponent', () => {
  let component: CsvpComponent;
  let fixture: ComponentFixture<CsvpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsvpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
