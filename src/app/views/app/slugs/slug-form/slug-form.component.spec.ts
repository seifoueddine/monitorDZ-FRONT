import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlugFormComponent } from './slug-form.component';

describe('SlugFormComponent', () => {
  let component: SlugFormComponent;
  let fixture: ComponentFixture<SlugFormComponent>;

  beforeEach(async(() => {
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
