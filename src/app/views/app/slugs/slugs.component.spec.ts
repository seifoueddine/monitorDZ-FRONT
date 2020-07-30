import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlugsComponent } from './slugs.component';

describe('SlugsComponent', () => {
  let component: SlugsComponent;
  let fixture: ComponentFixture<SlugsComponent>;

  beforeEach(async(() => {
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
