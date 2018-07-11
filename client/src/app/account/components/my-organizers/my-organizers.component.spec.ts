import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOrganizersComponent } from './my-organizers.component';

describe('MyOrganizersComponent', () => {
  let component: MyOrganizersComponent;
  let fixture: ComponentFixture<MyOrganizersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyOrganizersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOrganizersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
