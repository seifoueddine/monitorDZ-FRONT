import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SectorFormComponent } from './sector-form.component';

describe('SectorFormComponent', () => {
  let component: SectorFormComponent;
  let fixture: ComponentFixture<SectorFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SectorFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
