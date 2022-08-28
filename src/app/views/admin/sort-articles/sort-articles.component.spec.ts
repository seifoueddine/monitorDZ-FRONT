import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SortArticlesComponent } from './sort-articles.component';

describe('SortArticlesComponent', () => {
  let component: SortArticlesComponent;
  let fixture: ComponentFixture<SortArticlesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SortArticlesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
