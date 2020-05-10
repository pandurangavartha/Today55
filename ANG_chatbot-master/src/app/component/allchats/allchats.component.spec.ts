import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllchatsComponent } from './allchats.component';

describe('AllchatsComponent', () => {
  let component: AllchatsComponent;
  let fixture: ComponentFixture<AllchatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllchatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllchatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
