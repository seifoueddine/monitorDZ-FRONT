import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SlugFormComponent } from './slug-form.component';

describe('SlugFormComponent', () => {
  let component: SlugFormComponent;
  let fixture: ComponentFixture<SlugFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SlugFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlugFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
