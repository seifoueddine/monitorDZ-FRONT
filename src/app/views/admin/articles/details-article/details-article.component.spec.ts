import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DetailsArticleComponent } from './details-article.component';

describe('DetailsArticleComponent', () => {
  let component: DetailsArticleComponent;
  let fixture: ComponentFixture<DetailsArticleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsArticleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
