import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyReviewsComponent } from './my-reviews.component';

describe('MyReviewsComponent', () => {
  let component: MyReviewsComponent;
  let fixture: ComponentFixture<MyReviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyReviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
