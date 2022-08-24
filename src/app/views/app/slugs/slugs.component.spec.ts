import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SlugsComponent } from './slugs.component';

describe('SlugsComponent', () => {
  let component: SlugsComponent;
  let fixture: ComponentFixture<SlugsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SlugsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlugsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
