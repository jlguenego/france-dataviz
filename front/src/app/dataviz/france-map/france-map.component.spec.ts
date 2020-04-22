import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FranceMapComponent } from './france-map.component';

describe('FranceMapComponent', () => {
  let component: FranceMapComponent;
  let fixture: ComponentFixture<FranceMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FranceMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FranceMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
