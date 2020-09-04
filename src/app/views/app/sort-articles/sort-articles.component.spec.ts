import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortArticlesComponent } from './sort-articles.component';

describe('SortArticlesComponent', () => {
  let component: SortArticlesComponent;
  let fixture: ComponentFixture<SortArticlesComponent>;

  beforeEach(async(() => {
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
