import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrganizerComponent } from './edit-organizer.component';

describe('EditOrganizerComponent', () => {
  let component: EditOrganizerComponent;
  let fixture: ComponentFixture<EditOrganizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOrganizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOrganizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
