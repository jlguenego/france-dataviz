import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadFileFormComponent } from './load-file-form.component';

describe('LoadFileFormComponent', () => {
  let component: LoadFileFormComponent;
  let fixture: ComponentFixture<LoadFileFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadFileFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadFileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
