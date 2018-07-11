import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrganizerComponent } from './create-organizer.component';

describe('CreateOrganizerComponent', () => {
  let component: CreateOrganizerComponent;
  let fixture: ComponentFixture<CreateOrganizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOrganizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrganizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
